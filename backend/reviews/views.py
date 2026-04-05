from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    # ✅ FIX 1: Use all() for the base queryset so the Router can find the 'create' path
    # We will filter what the public sees in the 'list' action instead.
    queryset = Review.objects.all() 
    serializer_class = ReviewSerializer
    
    # ✅ FIX 2: Explicitly allow POST methods
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        """
        ✅ FIX 3: Only show 'is_visible' reviews to the public, 
        but allow admins to see everything.
        """
        user = self.request.user
        if self.action == 'list' and not user.is_staff:
            return Review.objects.filter(is_visible=True)
        return Review.objects.all()

    def get_permissions(self):
        if self.action == 'create' or self.action == 'list':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            # Saves guest_name, order_number, etc. from the React JSON payload
            serializer.save()