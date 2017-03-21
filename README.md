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

- 多光源
- 用face生成所有坐标
- 自定义贴图uv
- 几何形状: 长方体
- 几何形状: 球
- 几何形状: 柱
- 几何形状: 面
- 几何形状: 锥
- 贴图: 重复
