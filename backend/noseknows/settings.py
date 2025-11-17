from pathlib import Path
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = 'django-insecure-z%+p$e74q6p_)6sg@f)g#mq@g67bj-1b@f1wgqpvp2wsvsnbci'
DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # External apps
    'corsheaders',
    'rest_framework',

    # Internal apps
    'users',
    'products',
    'carts',
    'wishlist',
    'orders',
    'checkout',
    'reviews',
    'blog',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # allow frontend-backend communication
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'noseknows.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'noseknows.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME', 'noseknows'),
        'USER': os.getenv('DATABASE_USER', 'postgres'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD', ''),
        'HOST': os.getenv('DATABASE_HOST', 'localhost'),
        'PORT': os.getenv('DATABASE_PORT', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.User'

# DRF
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# CORS
CORS_ALLOW_ALL_ORIGINS = True
# or use this instead for better security:
# CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]

MPESA_CONSUMER_KEY = "your_consumer_key"
MPESA_CONSUMER_SECRET = "your_consumer_secret"
MPESA_SHORTCODE = "174379"  # test shortcode for sandbox
MPESA_PASSKEY = "your_passkey_from_portal"
MPESA_CALLBACK_URL = "https://yourdomain.com/api/mpesa/callback/"

# backend/noseknows/settings.py
# ... (at the end of your settings.py or wherever you put specific app settings)

JAZZMIN_SETTINGS = {
    # TITLE AND LOGO
    "site_title": "NoseKnows Admin",
    "site_header": "NoseKnows",
    "site_brand": "NoseKnows",
    "site_icon": "admin/img/favicon.png", # Path to your favicon, e.g., in static/admin/img/
    "welcome_sign": "Welcome to the NoseKnows Admin!",
    "copyright": "NoseKnows Ltd",
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "order_with_respect_to": ["users", "products", "orders", "carts", "wishlist", "blog", "reviews", "checkout"],

    # UI THEMES
    "topbar_material": "navbar-dark", # or navbar-light
    "sidebar_themes": {
        "darkly": "bg-dark", # A nice dark theme
        "flatly": "bg-light", # A light theme
        "cosmo": "bg-info", # A blue theme
    },
    "theme": "darkly", # Choose your preferred theme here
    "dark_mode_theme": "darkly", # Default dark mode theme
    "navbar_variants": [
        "navbar-dark", "navbar-primary", "navbar-info", "navbar-success",
        "navbar-warning", "navbar-danger", "navbar-white", "navbar-light"
    ],
    "sidebar_variants": [
        "sidebar-dark-primary", "sidebar-dark-info", "sidebar-dark-danger",
        "sidebar-light-primary", "sidebar-light-info", "sidebar-light-danger"
    ],
    "sidebar": "sidebar-dark-primary", # Or 'sidebar-light-info', etc.
    "brand_color": "navbar-primary",

    # ACTIONS & LINKS
    "custom_css": None, # Add path to custom CSS for finer adjustments
    "custom_js": None,
    "related_modal_active": False,
    "user_avatar": "null", # or "avatar.png" for a default user avatar if you have one

    "show_ui_builder": False, # Set to True temporarily to explore themes, then False for production

    "icons": {
        "auth": "fas fa-users-cog",
        "users.User": "fas fa-user",
        "auth.Group": "fas fa-users",
        "products.Product": "fas fa-box",
        "products.Category": "fas fa-tags",
        "orders.Order": "fas fa-shopping-cart",
        "carts.Cart": "fas fa-shopping-basket",
        "wishlist.Wishlist": "fas fa-heart",
        "reviews.Review": "fas fa-comments",
        "blog.Post": "fas fa-newspaper", # ✅ Blog icon
        "blog.Category": "fas fa-folder-open", # ✅ Blog category icon
        "checkout.Payment": "fas fa-money-check-alt",
        # You can add icons for all your models!
    },
    # list of apps (and/or models) to display in the side menu
    # flask style navigation
    "order_with_respect_to": [
        "users",
        "products",
        "orders",
        "carts",
        "wishlist",
        "reviews",
        "blog", # ✅ Blog app order
        "checkout",
        "auth",
    ],
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": False,
    "accent": "accent-primary",
    "navbar": "navbar-white navbar-light", # Light navbar
    "no_navbar_border": False,
    "navbar_fixed": False,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary", # Dark sidebar with primary accent
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "darkly", # Or 'flatly', 'vapor', 'sketchy', etc.
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-outline-primary",
        "secondary": "btn-outline-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    },
    "actions_classes": {
        "btn-danger": "btn-danger"
    }
}

