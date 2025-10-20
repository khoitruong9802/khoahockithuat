import React from "react";
import { Tabs } from "expo-router";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";

function TabBarIcon({ name, color }: { name: IconSymbolName; color: string }) {
  return <IconSymbol size={26} name={name} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#2563eb", // Tailwind blue-600
        tabBarInactiveTintColor: "#9ca3af", // Tailwind gray-400
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#e5e7eb",
          height: 60,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="test"
        options={{
          title: "Làm kiểm tra",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "Kết quả làm bài",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="paperplane.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat-bot"
        options={{
          title: "Trợ lý",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="bubble.left.and.bubble.right.fill"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person.crop.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
