from rest_framework import serializers
from .models import User, ClientProfile

class ClientProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ClientProfile
        # fields to include in the api for clientprofile 
        fields = ['company_name', 'address', 'phone_number', 'balance']

class UserSerializer(serializers.ModelSerializer):
   
    # required=False means it's not needed for other roles only for clients
    client_profile = ClientProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'client_profile']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
       
        profile_data = validated_data.pop('client_profile', None)
        
        user = User.objects.create_user(**validated_data)

        if user.role == User.Role.CLIENT and profile_data:
            ClientProfile.objects.create(user=user, **profile_data)
            
        return user
