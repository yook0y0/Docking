package org.docking.erbse.test;

import org.docking.erbse.email.EmailSendable;
import org.docking.erbse.email.EmailSender;

public class EmailTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
//		String memberId = "1";
//		String pw = "2";
//		String memberName = "3";
//		String type = "0";
		
		/*String msg = "<html><head><script type='text/javascript' language='javascript'>console.log('@@');function memberAddChk(){$.post('http://localhost:8089/Docking/memberAddChk',{memberId:"+ memberId +" ,pw: "+ pw + ",memberName: " + memberName + ",type: " + type + "},function(data){console.log('member add complete');});};</script></head><body><input type='button' value='�대┃' onclick='memberAddChk()'/></body></html>";
		*/
		/*String msg = "硫붿씪�댁슜!: <h1>�쒓� �뚯뒪��以묒엯�덈떎 <a href='http://www.naver.com'>www.naver.com</a></h1> <table bgcolor='ccccc'><tr><td>�대�吏�뀒�ㅽ듃<img src='http://www.rgagnon.com/images/jht.gif'></img></td></tr></table>";
		*/
		String msg = "<html><head><title></title></head><body><form name='form' method='post' action='http://localhost:8089/Docking/memberAddChk'><input type='hidden' name='memberId' value='1'><input type='hidden' name='pw' value='2'><input type='hidden' name='memberName' value='3'><input type='hidden' name='type' value='4'><input type='submit' value='�뺤씤'/></form></body></html>";
		EmailSendable emailSender = new EmailSender();

		emailSender.setTo("kimjin7167@naver.com");
		emailSender.setFrom("??");
		emailSender.setSubject("�쒕ぉ");
		emailSender.setContent(msg);
		emailSender.setContentType("text/html; charset=EUC-KR");
		emailSender.sendEmail();
	}
}
