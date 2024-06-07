'\nThis file was modified from CPython.\nCopyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,\n2011, 2012, 2013, 2014, 2015 Python Software Foundation; All Rights Reserved\n'
_I='InstanceType'
_H='__deepcopy__'
_G='__reduce__'
_F='__reduce_ex__'
_E='__copy__'
_D='__getinitargs__'
_C='__getstate__'
_B='__setstate__'
_A=None
import types
class Error(Exception):0
error=Error
class _EmptyClass:0
try:long
except NameError:long=int
try:bytes
except NameError:bytes=str
def check_notimplemented_state(x):
	A=getattr(x,_C,_A);B=getattr(x,_B,_A);C=getattr(x,_D,_A)
	if A or B or C:raise NotImplementedError('Skulpt does not yet support copying with user-defined __getstate__, __setstate__ or __getinitargs__()')
def copy(x):
	A=type(x)
	if callable(x):return x
	C=getattr(A,_E,_A)
	if C:return C(x)
	if A in(type(_A),int,float,bool,str,bytes,tuple,type,frozenset,long):return x
	if A==list or A==dict or A==set or A==slice:return A(x)
	B=getattr(x,_F,_A)
	if B:D=B(4)
	else:
		B=getattr(x,_G,_A)
		if B:D=B()
		elif str(A)[1:6]=='class':check_notimplemented_state(x);C=_copy_inst;return C(x)
		else:raise Error('un(shallow)copyable object of type %s'%A)
	if isinstance(D,str):return x
	return _reconstruct(x,D,0)
def _copy_inst(x):
	if hasattr(x,_E):return x.__copy__()
	if hasattr(x,_D):C=x.__getinitargs__();A=x.__class__(*C)
	else:A=_EmptyClass();A.__class__=x.__class__
	if hasattr(x,_C):B=x.__getstate__()
	else:B=x.__dict__
	if hasattr(A,_B):A.__setstate__(B)
	else:A.__dict__.update(B)
	return A
d=_deepcopy_dispatch={}
def deepcopy(x,memo=_A,_nil=[]):
	"Deep copy operation on arbitrary Python objects.\n    See the module's __doc__ string for more info.\n    ";A=memo
	if A is _A:A={}
	G=id(x);B=A.get(G,_nil)
	if B is not _nil:return B
	E=type(x);C=_deepcopy_dispatch.get(E)
	if C:B=C(x,A)
	else:
		try:H=issubclass(E,type)
		except TypeError:H=0
		if H:B=_deepcopy_atomic(x,A)
		else:
			C=getattr(x,_H,_A)
			if C:B=C(A)
			else:
				D=getattr(x,_F,_A)
				if D:F=D(2)
				else:
					F=_A;D=getattr(x,_G,_A)
					if D:F=D()
					elif str(E)[1:6]=='class':check_notimplemented_state(x);C=_deepcopy_dispatch[_I];B=C(x,A)
					else:raise Error('un(deep)copyable object of type %s'%E)
				if F is not _A:B=_reconstruct(x,F,1,A)
	A[G]=B;_keep_alive(x,A);return B
def _deepcopy_atomic(x,memo):return x
d[type(_A)]=_deepcopy_atomic
d[type(NotImplemented)]=_deepcopy_atomic
d[int]=_deepcopy_atomic
d[float]=_deepcopy_atomic
d[bool]=_deepcopy_atomic
d[complex]=_deepcopy_atomic
d[bytes]=_deepcopy_atomic
d[str]=_deepcopy_atomic
d[type]=_deepcopy_atomic
d[types.FunctionType]=_deepcopy_atomic
def _deepcopy_list(x,memo):
	A=[];memo[id(x)]=A
	for B in x:A.append(deepcopy(B,memo))
	return A
d[list]=_deepcopy_list
def _deepcopy_set(x,memo):
	A=set([]);memo[id(x)]=A
	for B in x:A.add(deepcopy(B,memo))
	return A
d[set]=_deepcopy_set
def _deepcopy_frozenset(x,memo):A=frozenset(_deepcopy_set(x,memo));memo[id(x)]=A;return A
d[frozenset]=_deepcopy_frozenset
def _deepcopy_tuple(x,memo):
	A=[deepcopy(A,memo)for A in x]
	try:return memo[id(x)]
	except KeyError:pass
	for(B,C)in zip(x,A):
		if B is not C:A=tuple(A);break
	else:A=x
	return A
d[tuple]=_deepcopy_tuple
def _deepcopy_dict(x,memo):
	A=memo;B={};A[id(x)]=B
	for(C,D)in x.items():B[deepcopy(C,A)]=deepcopy(D,A)
	return B
d[dict]=_deepcopy_dict
d[types.MethodType]=_deepcopy_atomic
def _deepcopy_inst(x,memo):
	C=memo
	if hasattr(x,_H):return x.__deepcopy__(C)
	if hasattr(x,_D):D=x.__getinitargs__();D=deepcopy(D,C);A=x.__class__(*D)
	else:A=_EmptyClass();A.__class__=x.__class__
	C[id(x)]=A
	if hasattr(x,_C):B=x.__getstate__()
	else:B=x.__dict__
	B=deepcopy(B,C)
	if hasattr(A,_B):A.__setstate__(B)
	else:A.__dict__.update(B);return A
d[_I]=_deepcopy_inst
def _keep_alive(x,memo):
	'Keeps a reference to the object x in the memo.\n    Because we remember objects by their id, we have\n    to assure that possibly temporary objects are kept\n    alive by referencing them.\n    We store a reference at the id of the memo, which should\n    normally not be used unless someone tries to deepcopy\n    the memo itself...\n    ';A=memo
	try:A[id(A)].append(x)
	except KeyError:A[id(A)]=[x]
def _reconstruct(x,info,deep,memo=_A):
	G=deep;D=info;B=memo
	if isinstance(D,str):return x
	assert isinstance(D,tuple)
	if B is _A:B={}
	H=len(D);assert H in(2,3,4,5);callable,I=D[:2]
	if H>2:A=D[2]
	else:A=_A
	if H>3:J=D[3]
	else:J=_A
	if H>4:K=D[4]
	else:K=_A
	if G:I=deepcopy(I,B)
	C=callable(*I);B[id(x)]=C
	if A is not _A:
		if G:A=deepcopy(A,B)
		if hasattr(C,_B):C.__setstate__(A)
		else:
			if isinstance(A,tuple)and len(A)==2:A,L=A
			else:L=_A
			if A is not _A:C.__dict__.update(A)
			if L is not _A:
				for(E,F)in L.items():setattr(C,E,F)
	if J is not _A:
		for M in J:
			if G:M=deepcopy(M,B)
			C.append(M)
	if K is not _A:
		for(E,F)in K:
			if G:E=deepcopy(E,B);F=deepcopy(F,B)
			C[E]=F
	return C
del d
del types
class _EmptyClass:0