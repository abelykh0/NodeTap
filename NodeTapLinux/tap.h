#pragma once

#define NODE_ADDON_API_DISABLE_DEPRECATED
//#define NAPI_CPP_EXCEPTIONS
#define NAPI_DISABLE_CPP_EXCEPTIONS
#include "napi.h"

using namespace Napi;

constexpr auto CANNOT_OPEN_TAP = "Error opening tap file";

Object Init(Env env, Object exports);

Value OpenTap(const CallbackInfo& info);
