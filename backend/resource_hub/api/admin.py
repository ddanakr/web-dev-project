from django.contrib import admin
from .models import Subject, Material, Favorite, Rating

admin.site.register(Subject)
admin.site.register(Material)
admin.site.register(Favorite)
admin.site.register(Rating)

