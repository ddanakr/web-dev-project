from django.urls import path, include
from .views import (
    MaterialListCreateAPIView,
    LoginView,
    subject_list,
    logout_view,
    RatingView,
    MaterialDetailAPIView,
    toggle_favorite
)



urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('materials/', MaterialListCreateAPIView.as_view(), name='materials-list'),
    path('subjects/', subject_list, name='subjects-list'),
    path('rate/', RatingView.as_view()),
    path('materials/<int:pk>/', MaterialDetailAPIView.as_view()),
    path('materials/<int:pk>/favorite/', toggle_favorite),
]