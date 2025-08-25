import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Mic, MicOff } from 'lucide-react-native';
import { useTheme } from '@/providers/theme-provider';
import { BRAND } from '@/constants/brand';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your VIBROVOLT assistant. How can I help you with your EV charging needs today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful EV charging assistant for VIBROVOLT. Help users with charging stations, bookings, payments, and general EV questions. Keep responses concise and helpful.',
            },
            {
              role: 'user',
              content: text,
            },
          ],
        }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.completion || 'I apologize, but I\'m having trouble responding right now. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Voice Input', 'Voice input is not available on web. Please type your message.');
      return;
    }
    
    setIsRecording(!isRecording);
    // In a real app, implement voice recording here
    Alert.alert('Voice Input', 'Voice input feature coming soon!');
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[styles.messageContainer, message.isUser ? styles.userMessage : styles.botMessage]}>
      <View style={[styles.messageIcon, { backgroundColor: message.isUser ? colors.primary : colors.card }]}>
        {message.isUser ? (
          <User size={16} color={message.isUser ? BRAND.colors.navy : colors.primary} />
        ) : (
          <Bot size={16} color={colors.primary} />
        )}
      </View>
      <View style={[styles.messageBubble, { 
        backgroundColor: message.isUser ? colors.primary : colors.card,
        borderColor: colors.border 
      }]}>
        <Text style={[styles.messageText, { 
          color: message.isUser ? BRAND.colors.navy : colors.text 
        }]}>
          {message.text}
        </Text>
        <Text style={[styles.messageTime, { 
          color: message.isUser ? `${BRAND.colors.navy}80` : colors.subtext 
        }]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={[styles.botAvatar, { backgroundColor: colors.primary }]}>
            <Bot size={24} color={BRAND.colors.navy} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>VIBROVOLT Assistant</Text>
            <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>Always here to help</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={[styles.messageContainer, styles.botMessage]}>
            <View style={[styles.messageIcon, { backgroundColor: colors.card }]}>
              <Bot size={16} color={colors.primary} />
            </View>
            <View style={[styles.messageBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.messageText, { color: colors.subtext }]}>Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={[styles.voiceButton, { backgroundColor: isRecording ? colors.primary : colors.background }]}
            onPress={handleVoiceInput}
            activeOpacity={0.8}
          >
            {isRecording ? (
              <MicOff size={20} color={BRAND.colors.navy} />
            ) : (
              <Mic size={20} color={colors.subtext} />
            )}
          </TouchableOpacity>
          
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: colors.background, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="Ask me anything about EV charging..."
            placeholderTextColor={colors.subtext}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage(inputText)}
            blurOnSubmit={false}
          />
          
          <TouchableOpacity
            style={[styles.sendButton, { 
              backgroundColor: inputText.trim() ? colors.primary : colors.card 
            }]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
            activeOpacity={0.8}
          >
            <Send size={20} color={inputText.trim() ? BRAND.colors.navy : colors.subtext} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});