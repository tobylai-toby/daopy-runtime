class NotImplementedImportError(ImportError,NotImplementedError):0
def _(name):A='{} is not yet implemented in Skulpt'.format(name);raise NotImplementedImportError(A,name=name)