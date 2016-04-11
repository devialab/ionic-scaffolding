#!/bin/sh
/usr/libexec/plistbuddy -c "add NSAppTransportSecurity:NSAllowsArbitraryLoads bool true" platforms/ios/plusuni-app/plusuni-app-Info.plist 2>/dev/null
true
