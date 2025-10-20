import React from "react";
import { Tabs } from "expo-router";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol, type IconSymbolName } from "@/components/ui/icon-symbol";

export default function TeacherLayout() {
  const tabIcon = (name: IconSymbolName) =>
    function TabBarIcon({ color }: { color: string }) {
      return <IconSymbol size={26} name={name} color={color} />;
    };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#2563eb", // blue-600
        tabBarInactiveTintColor: "#9ca3af", // gray-400
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
        name="subjects"
        options={{
          title: "Tạo câu hỏi",
          tabBarIcon: tabIcon("plus.circle.fill"),
        }}
      />

      <Tabs.Screen
        name="results"
        options={{
          title: "Quản lý học sinh",
          tabBarIcon: tabIcon("person.3.fill"),
        }}
      />

      <Tabs.Screen
        name="chat-bot"
        options={{
          title: "Trợ lý",
          tabBarIcon: tabIcon("bubble.left.and.bubble.right.fill"),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Tài khoản",
          tabBarIcon: tabIcon("person.crop.circle.fill"),
        }}
      />
    </Tabs>
  );
}
