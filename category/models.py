from django.db import models
import uuid
import os


def unique_category_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join("images", "categories", filename)


class CategoryParent(models.Model):
    title = models.CharField(max_length=255, unique=True)
    image = models.ImageField(upload_to=unique_category_image, null=True, blank=True)

    class Meta:
        db_table = "category_parent"

    def __str__(self):
        return self.title


class CategoryChild(models.Model):
    parent = models.ForeignKey(
        CategoryParent,
        on_delete=models.CASCADE,
        related_name="children"
    )
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to=unique_category_image, null=True, blank=True)

    class Meta:
        db_table = "category_child"

    def __str__(self):
        return f"{self.parent.title} → {self.title}"