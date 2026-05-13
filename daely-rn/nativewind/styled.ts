import { cssInterop } from "nativewind";
import React from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";

// Export styled components
export const StyledView = cssInterop(View, { className: "style" });
export const StyledText = cssInterop(Text, { className: "style" });
export const StyledPressable = cssInterop(Pressable, { className: "style" });
export const StyledScrollView = cssInterop(ScrollView, { className: "style" });
export const StyledImage = cssInterop(Image, { className: "style" });
