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

- Group
- 几何形状: 柱
- 自定义贴图uv
- 阴影
