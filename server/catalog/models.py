from django.db import models

class Products(models.Model):
    id = models.AutoField(primary_key=True)
    product_code = models.CharField(max_length=100, null=True, blank=True)
    name = models.CharField(max_length=255)
    buy_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    sell_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    quantity = models.IntegerField()
    descriptions = models.TextField(null=True, blank=True)
    more_description = models.TextField(null=True, blank=True)
    feature = models.JSONField(null=True, blank=True)
    status = models.CharField(max_length=50, default='active')
    category_id = models.ForeignKey(
        'category.CategoryChild',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
        db_column="category_id"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'

    def __str__(self):
        return self.name


class ProductImages(models.Model):
    id = models.AutoField(primary_key=True)
    
    product_id = models.ForeignKey(     
        Products,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="images",
        db_column="product_id"
    )    
    image = models.ImageField(upload_to='images/products/', null=True, blank=True)
    is_main = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'product_images'

    def __str__(self):
        if self.product_id:
            return f"{self.product_id.name} - Image"
        return f"Image {self.id}"