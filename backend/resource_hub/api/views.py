from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from django.db.models import Avg, Exists, OuterRef, Value, BooleanField
from django.db.models.functions import Coalesce

from .models import Subject, Material, Favorite, Rating
from .serializers import (
    SubjectSerializer,
    MaterialSerializer,
    LoginSerializer,
    RatingSerializer
)

from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate


# --- CBV ---

class MaterialListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        queryset = Material.objects.all().select_related('subject', 'owner')

        queryset = queryset.annotate(
            rating = Coalesce(Avg('ratings__value'), 0)
        )

        user = request.user

        if user.is_authenticated:
            queryset = queryset.annotate(
                is_favorite = Exists(
                    Favorite.objects.filter(
                        user=user,
                        material=OuterRef('pk')
                    )
                )
            )
        else:
            queryset = queryset.annotate(
                is_favorite = Value(False, output_field=BooleanField())
            )

        # filters
        subject_id = request.query_params.get('subject')
        search = request.query_params.get('search')

        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        
        if search:
            queryset = queryset.filter(title__icontains=search)

        # sorting
        ordering = request.query_params.get('ordering')
        allowed_ordering = ['created_at', 'downloads', 'rating']

        if ordering:
            field = ordering.lstrip('-')
            if field in allowed_ordering:
                queryset = queryset.order_by(ordering)
        
        serializer = MaterialSerializer(queryset, many=True, context={'request': request})

        return Response(serializer.data)
    
    def post(self, request):
        if not request.user.is_authenticated:
            return Response(status=403)
        
        serializer = MaterialSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class MaterialDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, request, pk):
        queryset = Material.objects.select_related('subject', 'owner')

        queryset = queryset.annotate(
            rating = Coalesce(Avg('ratings__value'), 0)
        )

        user = request.user

        if user.is_authenticated:
            queryset = queryset.annotate(
                is_favorite = Exists(
                    Favorite.objects.filter(
                        user=user,
                        material=OuterRef('pk')
                    )
                )
            )
        else:
            queryset = queryset.annotate(
                is_favorite = Value(False, output_field=BooleanField())
            )

        return get_object_or_404(queryset, pk=pk)
    

    def get(self, request, pk):
        material = self.get_object(request, pk)
        serializer = MaterialSerializer(material, context={'request': request})
        return Response(serializer.data)
    

    def put(self, request, pk):
        material = self.get_object(request, pk)

        if material.owner != request.user:
            return Response(status=403)
        
        serializer = MaterialSerializer(
            material, data=request.data,
            partial=False,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=400)
    

    def patch(self, request, pk):
        material = self.get_object(request, pk)

        if material.owner != request.user:
            return Response(status=403)
        
        serializer = MaterialSerializer(
            material, data=request.data,
            partial=True,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=400)
    

    def delete(self, request, pk):
        material = self.get_object(request, pk)

        if material.owner != request.user:
            return Response(status=403)
        
        material.delete()
        return Response(status=204)
    
        



class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(**serializer.validated_data)

        if not user or not user.is_active:
            return Response({'error': 'Invalid credentials'}, status=400)
        
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})


class RatingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = RatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        material_id = serializer.validated_data['material_id']
        value = serializer.validated_data['value']

        material = get_object_or_404(Material, id=material_id)
        Rating.objects.update_or_create(
            user=request.user,
            material=material,
            defaults={'value': value}
        )

        return Response({"status": "ok"})


# --- FBV ---

@api_view(['GET'])
def subject_list(request):
    subjects = Subject.objects.all()
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    if hasattr(request.user, 'auth_token'):
        request.user.auth_token.delete()
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_favorite(request, pk):
    fav, created = Favorite.objects.get_or_create(
        user=request.user,
        material_id = pk
    )

    if not created:
        fav.delete()

    return Response({"status": "ok"})