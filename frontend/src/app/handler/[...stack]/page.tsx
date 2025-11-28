import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/../stack/server";
import React from "react";

export default function Handler(props: { params: any; searchParams: any }) {
  return (
    <StackHandler app={stackServerApp} routeProps={props} fullPage={true} />
  );
}


