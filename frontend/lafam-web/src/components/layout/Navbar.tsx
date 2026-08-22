'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentGroup } from "@/lib/stores/currentGroup";

