import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { User, Car, Bell, Shield, HelpCircle, LogOut, ChevronRight, Zap, Moon, Edit3, Save, X } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "@/providers/auth-provider";
import { BRAND } from "@/constants/brand";
import { useTheme } from "@/providers/theme-provider";

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const { isDark, toggle } = useTheme();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: user?.name || "Demo User",
    email: user?.email || "demo@vibrovolt.com",
    phone: user?.phone || "+91 98765 43210"
  });

  React.useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)" as any);
  };

  const handleSave = async () => {
    try {
      if (!editForm.name.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
      
      await updateUser(editForm);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || "Demo User",
      email: user?.email || "demo@vibrovolt.com",
      phone: user?.phone || "+91 98765 43210"
    });
    setIsEditing(false);
  };

  const menuItems = [
    { icon: Car, label: "My Vehicles", route: "/vehicles" },
    { icon: Bell, label: "Notifications", hasSwitch: true },
    { icon: Shield, label: "Privacy & Security", route: "/privacy" },
    { icon: HelpCircle, label: "Help & Support", route: "/support" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[BRAND.colors.white, "rgba(10,14,39,0.06)"]}
        style={styles.profileHeader}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={40} color={BRAND.colors.green} />
          </View>
          <View style={styles.levelBadge}>
            <Zap size={12} color={BRAND.colors.navy} />
            <Text style={styles.levelText}>Gold</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
          activeOpacity={0.8}
        >
          {isEditing ? (
            <X size={20} color={BRAND.colors.slate} />
          ) : (
            <Edit3 size={20} color={BRAND.colors.green} />
          )}
        </TouchableOpacity>

        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.name}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter your name"
                placeholderTextColor={BRAND.colors.slate}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.email}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                placeholderTextColor={BRAND.colors.slate}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.phone}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
                placeholder="Enter your phone number"
                placeholderTextColor={BRAND.colors.slate}
                keyboardType="phone-pad"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Save size={16} color={BRAND.colors.white} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || "Demo User"}</Text>
            <Text style={styles.userEmail}>{user?.email || "demo@vibrovolt.com"}</Text>
            <Text style={styles.userPhone}>{user?.phone || "+91 98765 43210"}</Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>247</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1,842</Text>
            <Text style={styles.statLabel}>kWh Charged</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹52K</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} testID="appearance-toggle">
          <View style={styles.menuLeft}>
            <View style={styles.menuIcon}>
              <Moon size={20} color={BRAND.colors.green} />
            </View>
            <Text style={styles.menuLabel}>Appearance</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggle}
            trackColor={{ false: "#D1D6E6", true: BRAND.colors.green }}
            thumbColor={BRAND.colors.white}
          />
        </TouchableOpacity>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => item.route && router.push(item.route as any)}
            activeOpacity={0.8}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <item.icon size={20} color={BRAND.colors.green} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            {item.hasSwitch ? (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#D1D6E6", true: BRAND.colors.green }}
                thumbColor={BRAND.colors.white}
              />
            ) : (
              <ChevronRight size={20} color={BRAND.colors.slate} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <LogOut size={20} color="#FF6B6B" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.colors.white,
  },
  profileHeader: {
    padding: 24,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderWidth: 2,
    borderColor: BRAND.colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadge: {
    position: "absolute",
    bottom: 0,
    right: -8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "600",
    color: BRAND.colors.navy,
    marginLeft: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: BRAND.colors.navy,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: BRAND.colors.slate,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: BRAND.colors.slate,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10,14,39,0.04)",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(10,14,39,0.08)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: BRAND.colors.navy,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: BRAND.colors.slate,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(10,14,39,0.08)",
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: BRAND.colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(10,14,39,0.08)",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: BRAND.colors.navy,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 107, 107, 0.06)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.18)",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B6B",
    marginLeft: 8,
  },
  version: {
    fontSize: 12,
    color: BRAND.colors.slate,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  editButton: {
    position: "absolute",
    top: 24,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(10,14,39,0.08)",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  editForm: {
    width: "100%",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: BRAND.colors.navy,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: BRAND.colors.white,
    borderWidth: 1,
    borderColor: "rgba(10,14,39,0.12)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: BRAND.colors.navy,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BRAND.colors.green,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: BRAND.colors.white,
    marginLeft: 8,
  },
});