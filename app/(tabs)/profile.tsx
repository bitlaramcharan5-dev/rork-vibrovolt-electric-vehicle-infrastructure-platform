import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { User, Car, Bell, Shield, HelpCircle, LogOut, ChevronRight, Zap, Moon, Edit3, Save, X, Bot, Crown, Trophy } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "@/providers/auth-provider";
import { BRAND } from "@/constants/brand";
import { useTheme } from "@/providers/theme-provider";

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const { isDark, toggle, colors } = useTheme();
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

  const premiumItems = [
    { icon: Bot, label: "AI Assistant", route: "/chatbot" },
    { icon: Crown, label: "Subscription Plans", route: "/subscription" },
    { icon: Trophy, label: "Achievements", route: "/achievements" },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[colors.background, colors.card]}
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
              <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={editForm.name}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter your name"
                placeholderTextColor={colors.subtext}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={editForm.email}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                placeholderTextColor={colors.subtext}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Phone</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={editForm.phone}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.subtext}
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
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name || "Demo User"}</Text>
            <Text style={[styles.userEmail, { color: colors.subtext }]}>{user?.email || "demo@vibrovolt.com"}</Text>
            <Text style={[styles.userPhone, { color: colors.subtext }]}>{user?.phone || "+91 98765 43210"}</Text>
          </View>
        )}

        <View style={[styles.statsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>247</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Sessions</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>1,842</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>kWh Charged</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>₹52K</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Saved</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.menuSection}>
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.8} testID="appearance-toggle">
          <View style={styles.menuLeft}>
            <View style={styles.menuIcon}>
              <Moon size={20} color={BRAND.colors.green} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>Appearance</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggle}
            trackColor={{ false: "#D1D6E6", true: BRAND.colors.green }}
            thumbColor={BRAND.colors.white}
          />
        </TouchableOpacity>

        {premiumItems.map((item, index) => (
          <TouchableOpacity
            key={`premium-${index}`}
            style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => item.route && router.push(item.route as any)}
            activeOpacity={0.8}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <item.icon size={20} color={BRAND.colors.green} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            </View>
            <ChevronRight size={20} color={colors.subtext} />
          </TouchableOpacity>
        ))}

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => item.route && router.push(item.route as any)}
            activeOpacity={0.8}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <item.icon size={20} color={BRAND.colors.green} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            </View>
            {item.hasSwitch ? (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#D1D6E6", true: BRAND.colors.green }}
                thumbColor={BRAND.colors.white}
              />
            ) : (
              <ChevronRight size={20} color={colors.subtext} />
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
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
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
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
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