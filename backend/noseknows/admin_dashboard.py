# noseknows/admin_dashboard.py

from grappelli.dashboard import modules, Dashboard
from grappelli.dashboard.utils import get_admin_site_name
from django.utils.translation import gettext_lazy as _

class CustomIndexDashboard(Dashboard):
    columns = 3  # can adjust to 1, 2, or 3

    def init_with_context(self, context):
        site_name = get_admin_site_name(context)

        # --- Quick Links ---
        self.children.append(modules.LinkList(
            _('Quick Links'),
            layout='inline',
            children=[
                {'title': _('Add Product'), 'url': '/admin/products/product/add/', 'external': False},
                {'title': _('View Orders'), 'url': '/admin/orders/order/', 'external': False},
                {'title': _('Manage Users'), 'url': '/admin/users/user/', 'external': False},
            ]
        ))

        # --- E-commerce Models (Sidebar) ---
        self.children.append(modules.ModelList(
            _('Products'),
            models=('products.models.*',),
        ))

        self.children.append(modules.ModelList(
            _('Orders & Checkout'),
            models=('orders.models.*', 'checkout.models.*', 'carts.models.*', 'wishlist.models.*'),
        ))

        self.children.append(modules.ModelList(
            _('Users & Reviews'),
            models=('users.models.*', 'reviews.models.*'),
        ))

        # --- Recent Actions ---
        self.children.append(modules.RecentActions(
            _('Recent Activities'),
            include_list=('orders.Order', 'users.User', 'products.Product'),
            limit=10,
        ))
