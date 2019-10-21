import styled from 'styled-components';
export const Wrapper = styled.div`
    background-color: rgba(0, 100, 0, 0.2);
    box-sizing: border-box;
    padding: 1rem;
    border: 1px solid black;

    .__calheader {
        &__buttons {
            display: flex;
            justify-content: space-between;
        }
        text-align: center;
        &__label {
            display: inline-block;
            color: blue;
        }

        &__sublabel {
            display: inline-block;
        }
    }

    .__calcenter {
        border-top: 1px solid rgba(0, 0, 0, 0.4);
        border-left: 1px solid rgba(0, 0, 0, 0.4);
    }

    .__calrow {
        display: flex;
    }
    .nontest {
        background-color: rgba(0, 0, 0, 0.2);
    }
    .__calcell {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(100% / 7);
        height: 3rem;
        border: 1px solid rgba(0, 0, 0, 0.4);
        border-left: none;
        border-top: none;

        &_choosen {
            &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 0, 0, 0.4);
            }
        }

        &__selected {
            background-color: blue;
        }
        &__label {
            color: red;
        }
    }

    .__caldays {
        display: flex;
        &__cell {
            display: inline-block;
            width: calc(100% / 7);
            text-align: center;
        }
    }
    .__cal__endbuttons {
        padding-top: 1rem;
        display: flex;
        justify-content: space-between;
    }
`;
