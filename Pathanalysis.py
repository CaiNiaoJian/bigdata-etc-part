import pandas as pd
import plotly.graph_objects as go

# 1. 加载数据
file_path = 'data.csv'
data = pd.read_csv(file_path)

# 2. 路径分析：统计出入库站点组合
# 创建一个列，表示每一行的出入库站点路径
data['路径'] = data['SFZRKMC'] + ' -> ' + data['SFZCKMC']

# 统计路径的出现频率
path_frequency = data['路径'].value_counts()

# 提取最频繁的前10个出入库路径
top_paths = path_frequency.head(10)

# 分解路径为起点和终点
top_paths_df = top_paths.reset_index()
top_paths_df.columns = ['路径', '频率']
top_paths_df[['起点', '终点']] = top_paths_df['路径'].str.split(' -> ', expand=True)

# 3. 绘制弦图
# 获取起点、终点和频率
sources = top_paths_df['起点'].tolist()
targets = top_paths_df['终点'].tolist()
values = top_paths_df['频率'].tolist()

# 起点和终点的唯一集合（用于节点索引）
nodes = list(set(sources + targets))
node_indices = {node: i for i, node in enumerate(nodes)}

# 将起点和终点映射为索引
source_indices = [node_indices[src] for src in sources]
target_indices = [node_indices[tgt] for tgt in targets]

# 构建弦图
fig = go.Figure(data=[go.Sankey(
    node=dict(
        pad=15,
        thickness=20,
        line=dict(color="black", width=0.5),
        label=nodes,  # 节点标签
    ),
    link=dict(
        source=source_indices,  # 起点
        target=target_indices,  # 终点
        value=values,  # 流量值
    )
)])

# 设置图表标题
fig.update_layout(
    title_text="最常见的出入库收费站路径（弦图）",
    font_size=12,
    height=600
)

# 显示弦图
fig.show()
