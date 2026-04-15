from django.db import models
from django.conf import settings

class Subject(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    

class Material(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='materials', 
        on_delete=models.CASCADE
    )
    subject = models.ForeignKey(
        Subject, 
        related_name='materials', 
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    downloads = models.IntegerField(default=0)
    
    file = models.FileField(upload_to='materials/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    
class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name="favorites", 
        on_delete=models.CASCADE
    )
    material = models.ForeignKey(
        Material, 
        related_name="favorited_by", 
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ('user', 'material')


class Rating(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name="ratings",
        on_delete=models.CASCADE
    )
    material = models.ForeignKey(
        Material, 
        related_name="ratings",
        on_delete=models.CASCADE
    )

    value = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = ('user', 'material')
