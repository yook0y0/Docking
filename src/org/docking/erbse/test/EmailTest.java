package org.docking.erbse.test;

import org.docking.erbse.email.EmailSendable;
import org.docking.erbse.email.EmailSender;

public class EmailTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String memberId = "1";
		String pw = "2";
		String memberName = "3";
		String type = "0";
		
		/*String msg = "<html><head><script type='text/javascript' language='javascript'>console.log('@@');function memberAddChk(){$.post('http://localhost:8089/Docking/memberAddChk',{memberId:"+ memberId +" ,pw: "+ pw + ",memberName: " + memberName + ",type: " + type + "},function(data){console.log('member add complete');});};</script></head><body><input type='button' value='클릭' onclick='memberAddChk()'/></body></html>";
		*/
		/*String msg = "메일내용!: <h1>한글 테스트 중입니다 <a href='http://www.naver.com'>www.naver.com</a></h1> <table bgcolor='ccccc'><tr><td>이미지테스트<img src='http://www.rgagnon.com/images/jht.gif'></img></td></tr></table>";
		*/
		String msg = "<html><head><title></title></head><body><form name='form' method='post' action='http://localhost:8089/Docking/memberAddChk'><input type='hidden' name='memberId' value='1'><input type='hidden' name='pw' value='2'><input type='hidden' name='memberName' value='3'><input type='hidden' name='type' value='4'><input type='submit' value='확인'/></form></body></html>";
		EmailSendable emailSender = new EmailSender();

		emailSender.setTo("lih8989@naver.com");
		emailSender.setFrom("??");
		emailSender.setSubject("제목");
		emailSender.setContent(msg);
		emailSender.setContentType("text/html; charset=EUC-KR");
		emailSender.sendEmail();
	}
}
