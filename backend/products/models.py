from django.db import models
from django.utils.text import slugify


# ✅ Brand Model
class Brand(models.Model):
    name = models.CharField(max_length=200, unique=True)
    image = models.ImageField(upload_to='brands/', blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


# ✅ Category Model
class Category(models.Model):
    CATEGORY_CHOICES = [
        ("men", "Men"),
        ("women", "Women"),
        ("unisex", "Unisex"),
        ("niche", "Niche"),
        ("kids", "Kids"),
        
    ]
    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()


# ✅ ProductType Model
class ProductType(models.Model):
    name = models.CharField(max_length=100, unique=True)  # e.g. Eau de Parfum, Eau de Toilette

    def __str__(self):
        return self.name


# ✅ Main Product Model
class Product(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="products", null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    categories = models.ManyToManyField(Category, related_name="products", blank=True)
    product_type = models.ForeignKey(ProductType, on_delete=models.SET_NULL, null=True, blank=True)
    scent_notes = models.TextField(blank=True, help_text="E.g. Top: Bergamot, Heart: Jasmine, Base: Amber")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


# ✅ ProductVariant model (for size & price per size)
class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=50, help_text="e.g. 50ml, 100ml, 125ml")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.product.name} - {self.size}"


# ✅ ProductImage model (for multiple images per product)
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Image for {self.product.name}"
    

# ✅ FAQ model (for both Product & General FAQs)
class FAQ(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="faqs",
        null=True,
        blank=True,
        help_text="Leave empty if this FAQ is for general business questions."
    )
    question = models.CharField(max_length=255)
    answer = models.TextField()
    featured = models.BooleanField(
        default=False,
        help_text="Mark as featured to show on the homepage."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        if self.product:
            return f"FAQ ({self.product.name}): {self.question[:50]}"
        return f"General FAQ: {self.question[:50]}"

