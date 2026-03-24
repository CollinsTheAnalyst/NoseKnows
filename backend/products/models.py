from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator


# ✅ Brand Model (Combined and Cleaned)
class Brand(models.Model):
    name = models.CharField(max_length=200, unique=True)
    image = models.ImageField(upload_to='brands/', blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True, help_text="Used for Brand-specific SEO pages")

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
    name = models.CharField(max_length=100, unique=True) # e.g. Eau de Parfum
    def __str__(self):
        return self.name


# ✅ Tag Model (For Best Sellers, New Arrivals, etc.)
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# ✅ Main Product Model
# ✅ Main Product Model
class Product(models.Model):
    # --- Relations (RE-ADDED THESE) ---
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="products", null=True, blank=True)
    categories = models.ManyToManyField(Category, related_name="products", blank=True)
    product_type = models.ForeignKey(ProductType, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name="products", blank=True)

    # --- Core Info ---
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # --- Scent Profile (YOUR NEW FIELDS) ---
    top_notes = models.CharField(max_length=255, blank=True, help_text="e.g. Pear Blossom, Bergamot")
    heart_notes = models.CharField(max_length=255, blank=True, help_text="e.g. White Gardenia, Jasmine")
    base_notes = models.CharField(max_length=255, blank=True, help_text="e.g. Brown Sugar, Patchouli")
    
    # --- Status & Availability ---
    is_active = models.BooleanField(default=True, help_text="Uncheck to hide from shop")
    is_featured = models.BooleanField(default=False)
    in_stock = models.BooleanField(default=True)
    
    # --- SEO Fields ---
    meta_title = models.CharField(max_length=70, blank=True, help_text="Google title (max 70 chars)")
    meta_description = models.TextField(max_length=160, blank=True, help_text="Google snippet (max 160 chars)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


# ✅ ProductVariant model
class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=50, help_text="e.g. 100ml")
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Added "Compare at Price" for Shopify-style discounts
    compare_at_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        blank=True, 
        null=True, 
        help_text="The original price to show a discount (e.g., Ksh 5000)"
    )
    
    quantity_available = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)

    def __str__(self):
        return f"{self.product.name} - {self.size}"


# ✅ ProductImage model
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    is_feature = models.BooleanField(default=False, help_text="The primary image for the shop grid")
    alt_text = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Image for {self.product.name}"


# ✅ FAQ model
class FAQ(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="faqs", null=True, blank=True)
    question = models.CharField(max_length=255)
    answer = models.TextField()
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.question
    

