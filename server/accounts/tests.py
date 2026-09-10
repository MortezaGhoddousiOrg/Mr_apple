from django.test import TestCase
from rest_framework.test import APIClient
from authuser.models import User
from accounts.models import Users as LegacyUsers


class AccountsUserEndpointTests(TestCase):
    """
    Regression tests for the fix that points /api/accounts/user/ at the
    real auth model (authuser.User) instead of the disconnected legacy
    accounts.Users table.
    """

    def setUp(self):
        self.client = APIClient()
        self.real_user = User.objects.create(
            phone="09120000001",
            username="real_user",
            firstname="Ali",
            lastname="Ahmadi",
            email="ali@example.com",
            is_staff=False,
            is_active=True,
        )
        # A record in the old, disconnected legacy table — should never
        # be returned by the API anymore.
        LegacyUsers.objects.create(
            firstname="Ghost",
            lastname="Legacy",
            phone="09129999999",
            email="ghost@example.com",
            role="customer",
            status="active",
        )

    def test_list_returns_real_authuser_records_not_legacy_table(self):
        response = self.client.get("/api/accounts/user/")
        self.assertEqual(response.status_code, 200)

        phones = [item["phone"] for item in response.data]
        self.assertIn("09120000001", phones)
        self.assertNotIn("09129999999", phones)  # legacy record must not leak through

    def test_list_response_shape_matches_frontend_contract(self):
        response = self.client.get("/api/accounts/user/")
        self.assertEqual(response.status_code, 200)

        item = response.data[0]
        expected_fields = {
            "id", "firstname", "lastname", "phone",
            "email", "is_staff", "is_active", "created_at",
        }
        self.assertEqual(set(item.keys()), expected_fields)

    def test_detail_returns_real_user(self):
        response = self.client.get(f"/api/accounts/user/{self.real_user.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["phone"], "09120000001")
        self.assertEqual(response.data["firstname"], "Ali")

    def test_detail_404_for_legacy_only_id_mismatch(self):
        # Legacy table has its own auto-increment ids unrelated to authuser ids.
        bogus_id = 999999
        response = self.client.get(f"/api/accounts/user/{bogus_id}/")
        self.assertEqual(response.status_code, 404)

    def test_create_user_creates_in_authuser_table(self):
        payload = {
            "firstname": "Sara",
            "lastname": "Karimi",
            "phone": "09121112233",
            "email": "sara@example.com",
        }
        response = self.client.post("/api/accounts/user/", payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(phone="09121112233").exists())
        self.assertFalse(LegacyUsers.objects.filter(phone="09121112233").exists())

    def test_update_user(self):
        response = self.client.put(
            f"/api/accounts/user/{self.real_user.id}/",
            {"firstname": "Ali-Updated"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.real_user.refresh_from_db()
        self.assertEqual(self.real_user.firstname, "Ali-Updated")

    def test_delete_user(self):
        response = self.client.delete(f"/api/accounts/user/{self.real_user.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(id=self.real_user.id).exists())
