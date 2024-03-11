#include "tap.h"
#include <fcntl.h>
#include <sys/ioctl.h>
#include <net/if.h>
#include <linux/if_tun.h>

// ()
// returns: HANDLE
Value OpenTap(const CallbackInfo& info)
{
	Env env = info.Env();

	int handle = open("/dev/net/tun", O_RDWR);
	if (handle == -1)
	{
		handle = open("/dev/tun1", O_RDWR);
	}

	if (handle == -1)
	{
		Error::New(env, CANNOT_OPEN_TAP).ThrowAsJavaScriptException();
		return env.Null();
	}

	struct ifreq ifr;
	memset(&ifr, 0, sizeof(ifr));
	ifr.ifr_flags = IFF_TUN | IFF_NO_PI;

	if (ioctl(handle, TUNSETIFF, &ifr) == -1)
	{
		Error::New(env, CANNOT_OPEN_TAP).ThrowAsJavaScriptException();
		return env.Null();
	}

	return Number::New(env, (double)handle);
}
