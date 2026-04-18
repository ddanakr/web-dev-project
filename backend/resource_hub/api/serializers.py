from rest_framework import serializers
from .models import Subject, Material, Favorite

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class MaterialSerializer(serializers.ModelSerializer):
    subjectId = serializers.PrimaryKeyRelatedField(
        source = 'subject',
        queryset = Subject.objects.all()
    )

    # isFavorite = serializers.SerializerMethodField()
    isFavorite = serializers.BooleanField(source='is_favorite', read_only=True)
    owner = serializers.ReadOnlyField(source='owner.id')
    rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Material
        fields = [
            'id', 
            'title', 
            'subjectId', 
            'downloads', 
            'rating',
            'file', 
            'created_at',
            'owner', 
            'isFavorite'
        ]

    # def get_isFavorite(self, obj):
    #     request = self.context.get('request')
    #     if not request or not request.user.is_authenticated:
    #         return False
        
    #     return Favorite.objects.filter(
    #         user=request.user,
    #         material=obj
    #     ).exists()

    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RatingSerializer(serializers.Serializer):
    material_id = serializers.IntegerField()
    value = serializers.IntegerField(min_value=1, max_value=5)

