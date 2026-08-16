from django.db import models

class EducationImages(models.Model):
    image = models.ImageField(upload_to="education/images/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Education Image {self.id}"


class News(models.Model):
    TYPE_CHOICES = (
        ("news", "خبر"),
        ("tutorial", "آموزش"),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    publish_date = models.CharField(max_length=20)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="news")
    image = models.ForeignKey(
        EducationImages, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="news_images"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Tutorial(models.Model):
    TYPE_CHOICES = (
        ("news", "خبر"),
        ("tutorial", "آموزش"),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    publish_date = models.CharField(max_length=20)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="tutorial")
    image = models.ForeignKey(
        EducationImages, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="tutorial_images"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
class NewsGallery(models.Model):
    news = models.ForeignKey(
        News,
        on_delete=models.CASCADE,
        related_name="gallery"
    )
    image = models.ImageField(upload_to="education/news/gallery/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.news.title} - {self.id}"

class TutorialGallery(models.Model):
    tutorial = models.ForeignKey(
        Tutorial,
        on_delete=models.CASCADE,
        related_name="gallery"
    )
    image = models.ImageField(upload_to="education/tutorial/gallery/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tutorial.title} - {self.id}"
