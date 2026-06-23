"use client";
import { useAuth } from "@/hooks/use-auth";
import { User, Mail, Shield, MapPin } from "lucide-react"; // أيقونات لترتيب الشكل

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-sky-700 p-8 text-center text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
            <User size={48} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
          <p className="text-blue-100 text-sm">Manage your personal information</p>
        </div>

        
        <div className="p-8 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <User className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Full Name</p>
              <p className="text-gray-900 font-medium">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Mail className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Email Address</p>
              <p className="text-gray-900 font-medium">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Shield className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Account Role</p>
              <span className="inline-block bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold uppercase">
                {user?.role || "Standard User"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <MapPin className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Location</p>
              <p className="text-gray-900 font-medium">Palestine, Gaza</p>
            </div>
          </div>
        </div>

        
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <button className="text-sm text-primary font-semibold hover:underline">
            Update Profile Information
          </button>
        </div>
      </div>
    </div>
  );
}