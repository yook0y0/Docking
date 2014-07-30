package org.docking.erbse.test;

import org.docking.erbse.controller.DocumentController;
import org.docking.erbse.service.DocumentService;
import org.docking.erbse.service.DocumentServiceImpl;
import org.docking.erbse.service.MemberService;
import org.docking.erbse.service.MemberServiceImpl;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.ContentVO;
import org.docking.erbse.vo.DocumentVO;
import org.docking.erbse.vo.MemberContentVO;
import org.docking.erbse.vo.MemberVO;



public class ServiceTest {

	/**
	 * @param args
	 * @throws SecurityException 
	 * @throws NoSuchFieldException 
	 */
	public static void main(String[] args) throws NoSuchFieldException, SecurityException {
		// TODO Auto-generated method stub

		
		DocumentService ds = new DocumentServiceImpl();
		MemberService ms = new MemberServiceImpl();
		
/*		MemberVO mvo = new MemberVO();
		mvo.setMemberId("id1");
		mvo.setPw("1234");
		mvo.setMemberName("닉네임1");
		mvo.setType(0);
		ms.memberAdd(mvo);
		
		DocumentVO dvo = new DocumentVO();
		dvo.setDocumentId("d1");
		dvo.setTitle("테스트1");
		dvo.setWriter(mvo.getMemberId());
		dvo.setCreationDate("Date 1");
		ds.documentAdd(dvo);

		MemberContentVO mcvo = new MemberContentVO();
		mcvo.setDocumentId("d1");
		mcvo.setMemberId("i1");
		mcvo.setMemberPosition(0);
		
		ContentVO cvo = new ContentVO();
		cvo.setDocumentId("d1");
		cvo.setContentId("c4");
		cvo.setBody("내용~~~~~~~~~~");
		cvo.setEditorId("e4");
		ds.contentAdd(cvo);
		
		Integer num = ds.contentAdd(cvo);
		System.out.println("num : " + num);
		
		Integer num = ds.contentDelete(cvo.getContentId());
		
		System.out.println("ddd : " + cvo.getContentId());
		String res = ds.contentSearch(cvo.getContentId());
		
		System.out.println("res1 : " + res);
		
		res = ds.contentsList(cvo.getDocumentId());
		System.out.println("res2 : " + res);*/
		
/*		MemberContentVO mcvo = new MemberContentVO();
		mcvo.setDocumentId("d1");
		mcvo.setMemberId("i1");
		mcvo.setMemberPosition(0);
		ds.memberInvite(mcvo);*/
		
		String res = ds.joinDocumentList("id1");
		System.out.println("res : " + res);
	}
}
