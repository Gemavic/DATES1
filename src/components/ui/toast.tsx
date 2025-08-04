import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  variant?: 'default' | 'destructive' | 'success';
  title?: string;
  description?: string;
}

export const useToast = () => {
  const toast = ({ variant = 'default', title, description }: ToastProps) => {
    const toastElement = document.createElement('div');
    const variantClasses = {
      default: 'bg-white border-gray-200 text-gray-900',
      destructive: 'bg-red-500 border-red-600 text-white',
      success: 'bg-green-500 border-green-600 text-white'
    };
    
    toastElement.className = `fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg ${variantClasses[variant]} animate-slide-up`;
    toastElement.innerHTML = `
      ${title ? `<div class="font-semibold mb-1">${title}</div>` : ''}
      ${description ? `<div class="text-sm">${description}</div>` : ''}
    `;
    
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
      if (document.body.contains(toastElement)) {
        toastElement.remove();
      }
    }, 5000);
  };

  return { toast };
};