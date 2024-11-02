import { Button, Col, ColorPicker, Divider, Form, Input, List, Popconfirm, Row, Space, Spin, message } from 'antd'
import React from 'react'
import { red, blue, volcano, presetDarkPalettes, gold, lime, grey } from '@ant-design/colors';
import './Categories.css';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { useCategories, useCreateCategory, useDeleteCategory } from '../../services/Categories';
import { useQueryClient } from 'react-query';

function Categories() {
    const { data: categories, isLoading, isFetching } = useCategories()
    const createCategorieMutation =  useCreateCategory()
    const deleteCategorieMutation = useDeleteCategory()
    const queryClient = useQueryClient()
    
    const [form] = Form.useForm();
    const genPresets = (presets = presetDarkPalettes) =>
        Object.entries(presets).map(([label, colors]) => ({
            label,
            colors,
        }));
    const presets = genPresets({
        red,
        volcano,
        gold,
        lime,
        blue,
        grey,

    });

    const createCategory = async (values) => {
        const newCategorie = createCategorieMutation.mutateAsync(values)
        newCategorie
        .then(data => {
            message.success('Categoria creada correctamente.')
            queryClient.invalidateQueries({queryKey: ['categories']})
        })
        .catch(err => {
            message.error('Error al crear la cateogoria. Intentelo mas tarde!')
        })

    }
    const deleteCategory = async (id) => {
        const deleteCategory = deleteCategorieMutation.mutateAsync(id)

        deleteCategory
        .then(data => {
            message.info('Categoria eliminada corractamente.')
            queryClient.invalidateQueries({queryKey: ['categories']})
        })
        .catch(err => {
            message.error('No se pudo eliminar la categoria.')
        })
    }
    if (isLoading) {
        <Spin></Spin>
    }
    return (
        <>
            <Row gutter={[16, 16]}>

                <Col span={12}>
                    <div className='new-category'>
                        <h2>
                            Categorias
                        </h2>
                        <List
                            itemLayout='horizontal'
                            dataSource={categories}
                            renderItem={(item, index) => (
                                <List.Item
                                    actions={[
                                        <Popconfirm
                                            title="Eliminar categoria"
                                            description="Desea eliminar esta categoria?"
                                            onConfirm={()=>{deleteCategory(item.id)}}
                                            okText="Si"
                                        >
                                            <Button danger icon={<DeleteFilled></DeleteFilled>}></Button>
                                        </Popconfirm>]}>
                                    <List.Item.Meta
                                        avatar={<div style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            backgroundColor: `${item.attributes.color_categorie}`
                                        }}

                                        />}
                                        title={item.attributes.name}
                                    />
                                </List.Item>
                            )}
                        >

                        </List>
                    </div>
                </Col>
                <Col span={12} className=''>
                    <div className='new-category'>

                        <h2>
                            Crear Nueva Categoria
                        </h2>
                        <Form
                            layout='vertical'
                            onFinish={createCategory}
                            preserve={false}
                        >
                            <Row gutter={16}>
                                <Col span={18}>
                                    <Form.Item
                                        label={<strong>Nombre de la Categoria: </strong>}
                                        name="name"
                                        rules={[{ required: true, message: 'Por favor ingrese el nombre del proovedor' }]}
                                    >
                                        <Input placeholder='Ingrese el nombre de la categoria' />
                                    </Form.Item>
                                </Col>


                                <Col span={6}>
                                    <Form.Item
                                        label={<strong >Color: </strong>}
                                        name='color_categorie'
                                        getValueFromEvent={(e) => "#" + e.toHex()}
                                        rules={[{ required: true, message: 'Por favor selecciona un color' }]}
                                    >
                                        <ColorPicker


                                            onChange={(color, index) => {
                                                const hexadecimalColor = color.toHex();

                                                // Actualizar el formulario con el valor hexadecimal
                                                form.setFieldsValue({
                                                    [`list[${index}].color`]: hexadecimalColor,
                                                });
                                            }}
                                            presets={presets}
                                            panelRender={(_, { components: { Picker, Presets } }) => (
                                                <Row justify="space-between" wrap={false}>
                                                    <Col span={24} flex={'auto'}>
                                                        <Presets />
                                                    </Col>

                                                </Row>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item >
                                        <Space>
                                            <Button danger type="primary" htmlType="submit" icon={<PlusOutlined />} >
                                                CREAR CATEGORIA
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>

                    </div>

                </Col>
            </Row>
        </>
    )
                                            
                                            }
export default Categories