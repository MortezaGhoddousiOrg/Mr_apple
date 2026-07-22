from django.db import models


class News(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.CharField(max_length=500)  # آدرس عکس
    publish_date = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "education_news"
        ordering = ["-publish_date"]

    def __str__(self):
        return self.title


class Tutorial(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.CharField(max_length=500)  # آدرس عکس
    publish_date = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "education_tutorials"
        ordering = ["-publish_date"]

    def __str__(self):
        return self.title

class EducationImages(models.Model):
    image = models.CharField(max_length=500)  # فقط آدرس
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "education_images"

    def __str__(self):
        return self.image
