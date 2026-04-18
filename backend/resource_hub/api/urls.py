from django.urls import path, include
from .views import (
    MaterialListCreateAPIView,
    LoginView,
    subject_list,
    logout_view,
    RatingView,
    MaterialDetailAPIView,
    toggle_favorite,
    me,
    download_material
)



urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('materials/', MaterialListCreateAPIView.as_view(), name='materials-list'),
    path('subjects/', subject_list, name='subjects-list'),
    path('rate/', RatingView.as_view(), name='rate'),
    path('materials/<int:pk>/', MaterialDetailAPIView.as_view()),
    path('materials/<int:pk>/favorite/', toggle_favorite),
    path('me/', me, name='me'),
    path('materials/<int:pk>/download/', download_material, name='download')
]