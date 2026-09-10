from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from authuser.models import User
from education.models import Tutorial, TutorialGallery


def tiny_gif():
    content = (
        b'GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,'
        b'\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'
    )
    return SimpleUploadedFile("test.gif", content, content_type="image/gif")


class TutorialGalleryTests(TestCase):
    """
    Regression tests for the new Tutorial gallery feature (previously only
    News had gallery upload/attach/delete endpoints).
    """

    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create(
            phone="09120000002",
            username="admin_user",
            is_staff=True,
            is_active=True,
        )
        self.client.force_authenticate(user=self.admin)

        self.tutorial = Tutorial.objects.create(
            title="Test Tutorial",
            description="desc",
            publish_date="2026-09-09",
        )

    def test_decoupled_upload_creates_unattached_gallery_image(self):
        response = self.client.post(
            "/education/admin/tutorial-gallery/upload/",
            {"file": tiny_gif()},
            format="multipart",
        )
        self.assertEqual(response.status_code, 201)
        image_id = response.data["data"]["id"]
        gallery_item = TutorialGallery.objects.get(id=image_id)
        self.assertIsNone(gallery_item.tutorial)  # not attached yet

    def test_upload_attached_directly_to_tutorial(self):
        response = self.client.post(
            f"/education/admin/tutorials/{self.tutorial.id}/gallery/upload/",
            {"image": tiny_gif()},
            format="multipart",
        )
        self.assertEqual(response.status_code, 201)
        image_id = response.data["data"]["id"]
        gallery_item = TutorialGallery.objects.get(id=image_id)
        self.assertEqual(gallery_item.tutorial_id, self.tutorial.id)

    def test_attach_decoupled_images_via_gallery_ids_on_update(self):
        upload_resp = self.client.post(
            "/education/admin/tutorial-gallery/upload/",
            {"file": tiny_gif()},
            format="multipart",
        )
        image_id = upload_resp.data["data"]["id"]

        patch_resp = self.client.patch(
            f"/education/admin/tutorials/{self.tutorial.id}/",
            {"gallery_ids": [image_id]},
            format="json",
        )
        self.assertEqual(patch_resp.status_code, 200)

        gallery_item = TutorialGallery.objects.get(id=image_id)
        self.assertEqual(gallery_item.tutorial_id, self.tutorial.id)

    def test_delete_gallery_image(self):
        upload_resp = self.client.post(
            "/education/admin/tutorial-gallery/upload/",
            {"file": tiny_gif()},
            format="multipart",
        )
        image_id = upload_resp.data["data"]["id"]

        delete_resp = self.client.delete(f"/education/admin/tutorial-gallery/{image_id}/")
        self.assertEqual(delete_resp.status_code, 200)
        self.assertFalse(TutorialGallery.objects.filter(id=image_id).exists())

    def test_tutorial_detail_public_endpoint_returns_gallery_array(self):
        TutorialGallery.objects.create(tutorial=self.tutorial, image=tiny_gif())

        public_client = APIClient()  # no auth — public endpoint
        response = public_client.get(f"/education/tutorials/{self.tutorial.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("gallery", response.data)
        self.assertEqual(len(response.data["gallery"]), 1)
