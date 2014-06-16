import java.sql.Date;

import vo.DockingEnvironmentVO;
import vo.MemberVO;
import controller.DockingEnvironmentController;
import controller.MemberController;



public class TestMain 
{
	public static void main(String[] args) 
	{
		/*DockingEnvironmentController	dc = new DockingEnvironmentController();
		
		DockingEnvironmentVO	dv = new DockingEnvironmentVO();
		
		long	time = System.currentTimeMillis();
		
		dv.setCreationDate(new Date(time));
		dv.setDocId("docId");
		dv.setTitle("title");
		dv.setWriter("jason890@naver.com");
		
		dc.add("dockingEnvironment_add", dv);*/
		
		MemberController	mc = new MemberController();
		
		MemberVO	memberVO = new MemberVO();
		
		memberVO.setId("newTest");
		memberVO.setPw("newTest");
		memberVO.setNickName("newTest");
		memberVO.setMemberType(1);
		
		mc.add("member_add", memberVO);
	}
}
