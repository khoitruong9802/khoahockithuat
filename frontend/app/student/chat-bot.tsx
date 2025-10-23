import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Markdown from "react-native-markdown-display";

// Define the type for a single chat message
interface Message {
  id: string;
  text: string;
  isUser: boolean; // true for user, false for bot
}

// Define the component
const ChatScreen = () => {
  // State for the current message being typed
  const [inputText, setInputText] = useState("");
  // State for the conversation history
  const [messages, setMessages] = useState<Message[]>([]);
  // State for loading indicator (while waiting for bot response)
  const [isLoading, setIsLoading] = useState(false);

  // NEW STATE: To hold the current chat session ID for multi-turn conversations
  const [sessionId, setSessionId] = useState<string | null>(null);

  // --- Configuration ---
  // **IMPORTANT:** Replace 'YOUR_LOCAL_IP' with your actual local IP address
  // (e.g., '192.168.1.10:3000').
  const CHAT_API_URL =
    "https://khoahockithuat-136146701693.asia-southeast1.run.app/api/chat";
  // -----------------------

  // Function to handle sending a message
  const handleSend = async () => {
    if (inputText.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(), // Simple unique ID
      text: inputText.trim(),
      isUser: true,
    };

    // 1. Add user message to the chat list
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputText.trim(); // Capture message before clearing input
    setInputText("");
    setIsLoading(true);

    try {
      // 2. Prepare the payload, including the current sessionId (which will be null initially)
      const payload = {
        message: messageToSend,
        sessionId: sessionId,
      };

      // 3. Send the message to your Node.js backend
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Attempt to read the error body if available
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      // 4. Update the session ID with the one returned by the server
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        console.log("New Session ID established:", data.sessionId);
      }

      // 5. Add the bot's response to the chat list
      const botResponse: Message = {
        id: Date.now().toString() + "bot",
        text: data.reply || "Sorry, I received an empty or malformed reply.",
        isUser: false,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat API Error:", error);
      // Add an error message to the chat
      const errorMessage: Message = {
        id: Date.now().toString() + "error",
        text: "Connection error. Please check the server address and console for details.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render a single message bubble
  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userMessage : styles.botMessage,
      ]}
    >
      {item.isUser ? (
        <Text style={styles.messageText}>{item.text}</Text>
      ) : (
        <Markdown style={{ body: styles.botMessageText }}>{item.text}</Markdown>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Bot is typing...</Text>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          onSubmitEditing={handleSend} // Allows sending via keyboard 'Return' key
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (isLoading || inputText.trim() === "") && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={isLoading || inputText.trim() === ""}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
  },

  header: {
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  messagesList: {
    flex: 1,
    marginTop: 8,
  },

  messageBubble: {
    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    maxWidth: "80%",
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2563EB", // blue
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E7EB", // gray
  },

  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  botMessageText: {
    color: "#111827",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 10,
  },

  input: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 21,
    paddingHorizontal: 14,
    backgroundColor: "#F3F4F6",
    fontSize: 16,
    color: "#111827",
  },

  sendButton: {
    marginLeft: 10,
    backgroundColor: "#2563EB",
    borderRadius: 21,
    paddingHorizontal: 18,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E5E7EB",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#111827",
  },
});

export default ChatScreen;
