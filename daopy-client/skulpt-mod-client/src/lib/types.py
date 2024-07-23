'\nThis file was modified from CPython.\nCopyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,\n2011, 2012, 2013, 2014, 2015 Python Software Foundation; All Rights Reserved\n'
'Define names for all type symbols known in the standard interpreter.\nTypes that are part of optional modules (e.g. array) are not listed.\n'
import sys
MappingProxyType=type(type.__dict__)
WrapperDescriptorType=type(object.__init__)
MethodWrapperType=type(object().__str__)
MethodDescriptorType=type(str.join)
ClassMethodDescriptorType=type(dict.__dict__['fromkeys'])
NoneType=type(None)
TypeType=type
ObjectType=object
IntType=int
try:LongType=long
except:pass
FloatType=float
BooleanType=bool
try:ComplexType=complex
except NameError:pass
StringType=str
try:UnicodeType=unicode;StringTypes=StringType,UnicodeType
except NameError:StringTypes=StringType,
BufferType=buffer
TupleType=tuple
ListType=list
DictType=DictionaryType=dict
def _f():0
FunctionType=type(_f)
LambdaType=type(lambda:None)
def _g():yield 1
GeneratorType=type(_g())
class _C:
	def _m(self):0
ClassType=type(_C)
UnboundMethodType=type(_C._m)
_x=_C()
InstanceType=type(_x)
MethodType=type(_x._m)
BuiltinFunctionType=type(len)
BuiltinMethodType=type([].append)
ModuleType=type(sys)
FileType=file
try:XRangeType=xrange
except NameError:pass
SliceType=slice
EllipsisType=type(Ellipsis)
NotImplementedType=type(NotImplemented)
del sys,_f,_g,_C,_x
__all__=list(n for n in globals()if n[:1]!='_')
GenericAlias=type(type[int])