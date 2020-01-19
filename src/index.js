import React, { useState, useEffect } from 'react';
import withClickOutside from 'reacthook-withclickoutside'
import PropTypes from 'prop-types'
import './myselect.scss'

const MySelect = props => {
    const { selected, options, filter, placeholder, multiple, small, placeholderSearch } = props
    const [filterText, setFilterText] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [shouldBeUp, setShouldBeUp] = useState(false)
    const [state, setState] = useState({
        selectedValues: selected,
        listOptions: options,
        isFilter: filter
    })

    useEffect(() => {
        let isUpdate = false
        let nextState = { ...state }
        if (JSON.stringify(state.selectedValues) !== JSON.stringify(selected)) {
            nextState = { ...nextState, selectedValues: selected }
            isUpdate = true
        }
        if (JSON.stringify(state.listOptions) !== JSON.stringify(options)) {
            nextState = { ...nextState, listOptions: options }
            isUpdate = true
        }
        if (state.isFilter !== filter) {
            nextState = { ...nextState, isFilter: filter }
            isUpdate = true
        }
        if (isUpdate) setState(nextState)
    }, [selected, options, filter])

    const toggle = () => {
        if (!isOpen) {
            calculateAvailableSpace()
        }
        setIsOpen(!isOpen)
    }
    const close = () => {
        if (isOpen || filterText.length > 0) {
            setIsOpen(false)
            handleFilter('')
        }
    }

    const calculateAvailableSpace = () => {
        try {
            var inputRect = refMySelect.current.getBoundingClientRect();
            var windowHeight = window.innerHeight;
        } catch (err) {
            console.warn(err);
        }
        let topSpace = inputRect.top - 0;
        let bottomSpace = windowHeight - inputRect.bottom;
        let shouldBeUp = topSpace > bottomSpace;
        setShouldBeUp(shouldBeUp)
    }

    const handleSelectItem = (option) => {
        const { onChange, multiple } = props
        if (!multiple) {
            onChange([option.value])
            close()
        } else {
            const { selectedValues } = state
            const isExisted = selectedValues.findIndex(f => f == option.value) != -1
            if (isExisted) {
                let newSelected = selectedValues.filter(f => f != option.value)
                onChange(newSelected)
            } else {
                let newSelected = [...selectedValues, option.value]
                var mySet = new Set([...newSelected]);
                onChange([...mySet])
            }
        }
    }

    const handleRemoveItem = value => {
        const { onChange } = props
        const { selectedValues } = state
        let newSelected = selectedValues.filter(f => f != value)
        onChange(newSelected)
    }

    const renderSelectedOption = () => {
        const { multiple } = props
        const { selectedValues, listOptions } = state
        if (selectedValues && selectedValues.length) {
            let selected = ''
            if (multiple) {
                selected = []
                selected = selectedValues && selectedValues.map((value, index) => {
                    const option = listOptions.find(f => f.value == value)
                    const optionName = option && option.name || ''
                    return (
                        <div className="multiple-option-selected" key={index}>
                            <span>{optionName}</span>
                            <span className="multiple-option-selected-icon" onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleRemoveItem(value)
                            }}></span>
                        </div>
                    )
                })
            } else {
                const selectedId = selectedValues[0]
                const selectedOption = options.find(f => f.value == selectedId)
                selected = selectedOption && selectedOption.name || ''
            }
            return <span className="myselect-option-selected">
                {selected}
            </span>
        }
        if (placeholder) {
            return <span className="myselect-place-holder">{placeholder}</span>
        }
        return <span className="myselect-option-selected"></span>
    }

    const handleFilter = value => {
        const newOptions = options.filter(f => f.name.indexOf(value) != -1)
        setState({
            ...state,
            listOptions: newOptions
        })
        setFilterText(value)
    }

    const refMySelect = withClickOutside(close);
    const { isFilter, listOptions, selectedValues } = state
    return (
        <div className={`myselect-container ${small ? "small" : ""}`} ref={refMySelect}>
            <div className={`myselect-selected ${multiple ? 'multiple' : ''}`} onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                toggle()
            }}>
                {
                    renderSelectedOption()
                }
                <span className={`myselect-icon ${isOpen ? 'open' : ''}`}>
                    &#9660;
                </span>
            </div>
            <div className={`myselect-options ${isOpen ? 'open' : 'closed'} ${shouldBeUp ? 'up' : 'down'}`}>
                {isFilter && <input type="text"
                    className="myselect-filter"
                    placeholder={placeholderSearch}
                    value={filterText}
                    onChange={e => { handleFilter(e.target.value) }} />}
                {
                    listOptions && listOptions.map(
                        (option, index) => {
                            return <div key={index}
                                className={`option ${selectedValues.findIndex(f => f == option.value) == -1 ? '' : 'active'}`}
                                onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleSelectItem(option)
                                }}>
                                {option.name}
                            </div>
                        }
                    )
                }
            </div>
        </div>
    );
}
MySelect.propTypes = {
    selected: PropTypes.array,
    options: PropTypes.array,
    filter: PropTypes.bool,
    multiple: PropTypes.bool,
    small: PropTypes.bool,
    placeholder: PropTypes.string,
    placeholderSearch: PropTypes.string,
}
MySelect.defaultProps = {
    selected: [],
    options: [],
    filter: false,
    multiple: false,
    small: false,
    placeholder: 'Chọn',
    placeholderSearch: 'Tìm kiếm ...'
}
export default MySelect;