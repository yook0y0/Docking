package kr.co.docking.email;

public interface EmailSendable {
	void setContent(String content);
	void setFrom(String from);
	void setSubject(String subject);
	void setTo(String to);
	void sendEmail();
}
