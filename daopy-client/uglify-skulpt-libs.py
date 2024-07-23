import os,shutil
import python_minifier
path="skulpt-mod/src/lib_backup"
to_path="skulpt-mod/src/lib"
# walk all file including subfolders's files!!
#os.walk()
for root, dirs, files in os.walk(path, topdown=False):
    for name in files:
        i=os.path.relpath(os.path.join(root, name),path)
        print(path,i)
        if i.endswith(".js"):
            to=os.path.join(to_path,i)
            to_basedir=os.path.dirname(to)
            if not os.path.exists(to_basedir):
                os.makedirs(to_basedir,exist_ok=True)
            os.system(f"uglifyjs {os.path.join(path,i)} --compress --mangle --output {to}")
        elif i.endswith(".py"):
            to=os.path.join(to_path,i)
            to_basedir=os.path.dirname(to)
            if not os.path.exists(to_basedir):
                os.makedirs(to_basedir,exist_ok=True)
            with open(os.path.join(path,i),'r') as f:
                code=f.read()
            code=python_minifier.minify(code)
            with open(to,'w') as f:
                f.write(code)
        else:
            to=os.path.join(to_path,i)
            to_basedir=os.path.dirname(to)
            if not os.path.exists(to_basedir):
                os.makedirs(to_basedir,exist_ok=True)
            shutil.copy(os.path.join(path,i),to)