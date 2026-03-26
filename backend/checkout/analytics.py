import json
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import Order 
from users.models import User
from products.models import Product

def get_analytics_data():
    # Check if we have real data
    completed_orders = Order.objects.filter(status='COMPLETED')
    has_real_data = completed_orders.exists()

    if not has_real_data:
        # --- MOCK DATA FOR CLIENT DEMO ---
        kpi_list = [
            ("Total Sales", "2,450", "fas fa-shopping-bag", "#3c50e0"),
            ("Total Orders", "3,120", "fas fa-cart-plus", "#10b981"),
            ("Total Revenue", "Ksh 3.2M", "fas fa-wallet", "#ffba00"),
            ("Total Customers", "1,840", "fas fa-users", "#ff6b6b"),
            ("Site Visits", "12,505", "fas fa-eye", "#8e44ad"),
        ]
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        revenue_trend = [18400, 22900, 15000, 28500, 22000, 34000, 29800]
        
        # Mock objects (dictionaries that look like models)
        recent_orders = [
            {'phone': '0712 XXX 890', 'amount': '12,500', 'status': 'Paid', 'created_at_fixed': '2 mins ago'},
            {'phone': '0722 XXX 123', 'amount': '8,200', 'status': 'Paid', 'created_at_fixed': '15 mins ago'},
            {'phone': '0701 XXX 444', 'amount': '15,000', 'status': 'Pending', 'created_at_fixed': '1 hour ago'},
        ]
        top_products = [
            {'name': 'Gucci Flora', 'category': 'Perfumes', 'total_sold': 82, 'total_earned': 1025000},
            {'name': 'Chanel No. 5', 'category': 'Perfumes', 'total_sold': 64, 'total_earned': 972800},
            {'name': 'Dior Sauvage', 'category': 'Men', 'total_sold': 45, 'total_earned': 540000},
        ]
    else:
        # --- REAL DATABASE LOGIC ---
        total_customers = User.objects.count()
        total_orders = Order.objects.count()
        total_sales_count = completed_orders.count()
        total_revenue = completed_orders.aggregate(Sum('amount'))['amount__sum'] or 0
        
        kpi_list = [
            ("Total Sales", f"{total_sales_count:,}", "fas fa-shopping-bag", "#3c50e0"),
            ("Total Orders", f"{total_orders:,}", "fas fa-cart-plus", "#10b981"),
            ("Total Revenue", f"Ksh {total_revenue:,.0f}", "fas fa-wallet", "#ffba00"),
            ("Total Customers", f"{total_customers:,}", "fas fa-users", "#ff6b6b"),
            ("Site Visits", f"{total_customers * 12:,}", "fas fa-eye", "#8e44ad"),
        ]
        
        # Real Trend Calculation
        today = timezone.now().date()
        labels, revenue_trend = [], []
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            labels.append(date.strftime('%a'))
            daily_rev = Order.objects.filter(status='COMPLETED', created_at__date=date).aggregate(Sum('amount'))['amount__sum'] or 0
            revenue_trend.append(float(daily_rev))
            
        recent_orders = Order.objects.all().order_by('-created_at')[:5]
        top_products = Product.objects.filter(order__status='COMPLETED').annotate(
            total_sold=Count('order'), total_earned=Sum('order__amount')
        ).order_by('-total_sold')[:5]

    return {
        "kpi_list": kpi_list,
        "recent_orders": recent_orders,
        "top_products": top_products,
        "chart_labels": json.dumps(labels),
        "chart_revenue": json.dumps(revenue_trend),
        "demo_mode": not has_real_data # Useful flag for the template
    }