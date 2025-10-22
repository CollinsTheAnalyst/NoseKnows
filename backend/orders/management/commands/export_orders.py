from django.core.management.base import BaseCommand
from orders.models import Order
import csv

class Command(BaseCommand):
    help = 'Export all orders to CSV in a compact format with user email'

    def handle(self, *args, **kwargs):
        with open('orders_export.csv', 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['Order ID', 'User', 'Email', 'Status', 'Total Amount', 'Created At', 'Items']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()

            for order in Order.objects.all():
                items_str = "; ".join([
                    f"{item.product.name} x {item.quantity} (@{item.price})"
                    for item in order.items.all()
                ]) if hasattr(order, 'items') else ''

                writer.writerow({
                    'Order ID': order.id,
                    'User': order.user.username,
                    'Email': order.user.email,
                    'Status': order.status,
                    'Total Amount': order.total_amount,
                    'Created At': order.created_at.strftime('%Y-%m-%d %H:%M'),
                    'Items': items_str
                })

        self.stdout.write(self.style.SUCCESS('Orders exported successfully to orders_export.csv'))
