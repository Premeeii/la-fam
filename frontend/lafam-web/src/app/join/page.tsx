'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { previewInviteToken, joinGroup } from '@/lib/api/groups';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Link from 'next/link';

import { usePreviewJoinGroup } from '@/lib/hooks/useGroup';

function getInitials(name?: string) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function JoinGroupContent() {
  const { 
    token, 
    user, 
    isUserLoading, 
    previewData, 
    isPreviewLoading, 
    previewError, 
    joinMutation, 
    router 
  } = usePreviewJoinGroup();

  const handleJoinClick = () => {
    if (token) {
      joinMutation.mutate(token);
    }
  };

  const handleLoginClick = () => {
    if (token) {
      sessionStorage.setItem('pendingInviteToken', token);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 text-center shadow-lg border-0 rounded-2xl max-w-sm w-full">
          <h2 className="text-xl font-bold text-gray-900">Invalid Invite Link</h2>
          <p className="text-gray-500 mt-2">No token provided in the URL.</p>
        </Card>
      </div>
    );
  }

  if (isPreviewLoading || isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-gray-500">Loading invite details...</div>
      </div>
    );
  }

  if (previewError || !previewData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 text-center shadow-lg border-0 rounded-2xl max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ✕
          </div>
          <h2 className="text-xl font-bold text-gray-900">Token ไม่ถูกต้อง/หมดอายุ</h2>
          <p className="text-gray-500 mt-2">This invite link is invalid, has expired, or has already been used.</p>
          <Button className="mt-6 w-full" variant="outline" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="p-8 text-center shadow-lg border-0 rounded-2xl max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">You've been invited!</h1>
        
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl w-full border border-gray-100">
            <Avatar className="h-16 w-16 shadow-sm border border-gray-200">
                {previewData.groupAvatarUrl && (
                  <AvatarImage src={previewData.groupAvatarUrl} alt={previewData.groupName} className="object-cover" />
                )}
                <AvatarFallback className="text-lg font-bold bg-blue-50 text-blue-600">
                  {getInitials(previewData.groupName)}
                </AvatarFallback>
            </Avatar>
            <div className="text-left flex-1">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{previewData.groupName}</h3>
                <p className="text-sm text-gray-500">
                    Invited by <span className="font-semibold text-gray-700">{previewData.inviterName}</span>
                </p>
            </div>
        </div>

        {user ? (
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-4">
              You are logged in as <span className="font-semibold">{user.displayName}</span>
            </p>
            <Button 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-xl"
              onClick={handleJoinClick}
              disabled={joinMutation.isPending}
            >
              {joinMutation.isPending ? 'Joining...' : 'Join Group'}
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <p className="text-sm text-gray-500 mb-2">Please login or create an account to join.</p>
            <Link href="/login" onClick={handleLoginClick} className="w-full">
                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-xl">
                Login to Join
                </Button>
            </Link>
            <Link href="/register" onClick={handleLoginClick} className="w-full">
                <Button variant="outline" className="w-full h-11 font-medium text-lg rounded-xl">
                Create Account
                </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-50">Loading...</div>}>
      <JoinGroupContent />
    </Suspense>
  );
}
