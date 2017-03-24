# Space

## 性能优化:

#### buffer缓存
似乎并没有办法真正的缓存
- aPosition顶点位置, 每帧都在变化, pass
- aNormal法线, 每次都在变化, pass
- aTexCoord不变,很适合缓存
- indices适合缓存


#### getUniform的时间消耗好大, 能不能缓存
每次编译链接之后, 一个shaderProgram里面的各个uniform和attr编号应该是不变的, 没有必要重复定位

#### texture缓存


## TODO

#### 暂时不要去考虑扩展性问题, 不要假设用户的存在

- 阴影
- Group
- 几何形状: 柱
- 自定义贴图uv

## 坑

#### 谜一样的编译优化
webGLshader在不同平台上编译会有不同的优化
没有使用过的attribute和uniform是无法get的
但是对于"没有使用过"的定义, 不同平台却有着不同的优化

确定不会运行的语句会在编译时直接被删掉
如 `false && fun(a)` a不会成为active attribute, 可以直接不传值, 也不会被检查
然而 `bool(var_false) && fun(a)` a是active的, 不传的话就会warning!

然然而
```
color = aColor;
color = bColor;
```
在不同平台上竟然有不同的优化
mac会认为aColor是active attribute, linux则认为a不是

#### getXxxLocation
这个获取的不是shader中定义过的变量
而是定义过而且active的变量
编译器来决定谁是active的:)

#### 纹理单元
纹理单元似乎并没有存储纹理的功能

```
gl.activeTexture(gl["TEXTURE" + unitNum])
gl.bindTexture(gl.TEXTURE_2D, texture)
gl.uniform1i(s, unitNum)
```

每次使用都必须有这三个, 而不能只有`gl.uniform1i(s, unitNum)`
而且其中的`texture`必须是那个特定的texture而不能公用
似乎数据时储存在texture中的而不是纹理单元中
纹理单元应该是个处理单元而非储存单元
`texImage2D`是纹理单元的配置, 如果图片很大,该步骤十分昂贵
