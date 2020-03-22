### 基本类型

|ref|cpp|
|--|--|
|int8      |  Signed 8-bit Integer|
| uint8 |         Unsigned 8-bit Integer |
| int16 |         Signed 16-bit Integer |
| uint16 |        Unsigned 16-bit Integer |
| int32 |         Signed 32-bit Integer |
| uint32 |        Unsigned 32-bit Integer |
| int64 |         Signed 64-bit Integer |
| uint64 |        Unsigned 64-bit Integer |
| float |         Single Precision Floating Point Number (float) |
| double |        Double Precision Floating Point Number (double) |
| pointer |       Pointer Type |
| string |        Null-Terminated String (char *) |


### 常见的C语言类型
|ref|c|
|--|--|
| byte |          unsigned char |
| char |          char |
| uchar |         unsigned char |
| short |         short |
| ushort |        unsigned short |
| int |           int |
| uint |          unsigned int |
| long |          long |
| ulong |         unsigned long |
|longlong |   long|
|ulonglong  |   unsigned long long|
| size_t |        platform-dependent, usually pointer size |

### 问题

* win32 error 126 Dll文件的路径写错了，或者Dll有相关的依赖，依赖没有放在与入口Dll在同一级目录下
* win32 error 127 ffi定义的函数名、返回值类型或者参数类型与Dll定义的不一致
* win32 error 193 Dll与当前的操作系统不匹配，当前系统是64位的Dll是32位的



[https://segmentfault.com/a/1190000019402908]
