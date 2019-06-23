import React, { Component } from 'react';
import './css/MeetBar.css';
import { inject, observer }from 'mobx-react';

@inject('states')
@observer
class MeetBar extends Component {

    ChangeGender = (data) => {
        const { user } = this.props.states;
        user.gender = data;
        console.log('성별 확인 : ', user.gender);
    }

    ChangeWishGender = (data) => {
        const { user } = this.props.states;
        user.wishgender = data;
        console.log('원하는 성별 확인 : ',user.wishgender);
    }

    ChangeName = (data) => {
        const { user } = this.props.states;
        user.nickname = data.target.value;
        console.log('이름 값 확인 : ', user.nickname);
    }

    componentDidUpdate() {
        console.log('업데이트:')
    }

    render() {
        const { user } = this.props.states;
        console.log('유저 확인 : ', user.id, user.nickname, user.gender, user.wishgender, user.img);

        return (
        <div className="MeetBar">
            <div className="SetNickName">
                <div>
                    nickname (max : 15)
                </div>
                <input type="text"
                    defaultValue={user.nickname}
                    onChange={this.ChangeName}
                    maxLength="15"
                ></input>
            </div>
            
            <div className="Gender">
                <div>Gender</div>
                <input type="radio" 
                    name="gender" 
                    id="FemaleInput"
                    onClick={e => this.ChangeGender('Female')}
                />
                <label htmlFor="FemaleInput" className="GenderLabel01">Female</label>

                <input type="radio" 
                    name="gender" 
                    id="MaleInput"
                    onClick={e => this.ChangeGender('Male')}
                />
                <label htmlFor="MaleInput" className="GenderLabel02">Male</label>
            </div>

            <div className="WishGender">
                <div>WishGender</div>
                <input type="radio" 
                    name="wishgender" 
                    id="wishFemaleInput"
                    onClick={e => this.ChangeWishGender('Female')}
                />
                <label htmlFor="wishFemaleInput" className="wishGenderLabel01">Female</label>

                <input type="radio" 
                    name="wishgender" 
                    id="wishMaleInput"
                    onClick={e => this.ChangeWishGender('Male')}
                />
                <label htmlFor="wishMaleInput" className="wishGenderLabel02">Male</label>
            </div>
        </div>
        );
    }
}

export default MeetBar;