import os
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.conf import settings
from .models import ProductImages


@receiver(post_delete, sender=ProductImages)
def auto_delete_image_on_delete(sender, instance, **kwargs):
    if instance.image:
        image_path = os.path.join(settings.MEDIA_ROOT, instance.image.name)
        if os.path.isfile(image_path):
            os.remove(image_path)