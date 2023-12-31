[toc]



# 一、需求分析

**1、项目背景**

本项目旨在解决当下校园及社区流浪猫领养系统不够完善的问题，以及规范化流浪猫领养行为，促进流浪猫保护事业的发展。同时，我们也希望通过该平台，提高公众对流浪猫保护的认识，促进爱护动物的理念普及。

**2、市场分析**

在市面上，目前已存在一些针对流浪猫管理和领养的平台，例如“爱宠社区”、“猫眼看世界”等。但是这些平台往往只提供了流浪猫信息的展示和领养服务，缺乏对流浪猫全生命周期的管理，而且这些平台的推广也存在一定的局限性。因此，我们希望通过微信小程序这一平台，让更多的人参与到流浪猫保护事业中来，实现对流浪猫全生命周期的管理和规范化领养行为。

**3、项目介绍**

本小程序的主要面向用户为关注流浪猫保护事业的公众，特别是在校大学生和社区居民。小程序的主要功能包括流浪猫信息的浏览、管理和发布，领养申请的提交和审核，以及流浪猫公益活动、爱心捐赠、文明宣传、信息发布和评论留言等特色功能。主要性能包括流畅的用户体验、实时的信息更新、安全的数据存储和交互等。我们希望通过本项目，推动流浪猫保护事业的发展，实现人与动物的和谐共处。

# 二、概要设计



![img](file:////Users/chenyq/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_image001.png)

**1、用户模块**

该模块主要是针对普通用户的需求，提供以下功能：

(1) 用户登录：用户通过微信授权登录，可以使用小程序的各项功能。

(2) 浏览流浪猫信息：用户可以浏览平台上的流浪猫信息，并查看每只猫的详细信息。

(3) 发布猫咪信息：用户可以上传猫咪的照片以及详细信息，并发布到平台上。

(4) 提交反馈信息：用户可以向管理员提交反馈信息，以便管理员改进平台。

该模块与其他模块的调用关系：用户模块的功能主要是供普通用户使用，不涉及其他模块的调用。

该模块的接口：该模块需要与微信授权登录接口进行交互，以实现用户登录功能。

该模块的人机界面：该模块需要提供登录界面、浏览流浪猫信息界面、发布猫咪信息界面、反馈信息界面等。

 

**2、流浪猫信息管理模块**

该模块负责管理流浪猫的信息，包括添加、修改、删除、消息推送、数据统计流浪猫信息等功能。该模块主要包括以下几个子模块：

（1）流浪猫信息添加模块：负责添加流浪猫的基本信息，包括猫咪的名字、性别、年龄、品种、颜色等信息，同时也可以上传猫咪的照片。该模块调用了照片上传模块，通过接口获取上传的照片。

（2）流浪猫信息修改模块：负责修改流浪猫的基本信息，管理员可以通过该模块对流浪猫的基本信息进行修改。该模块调用了流浪猫信息查询模块，通过接口获取需要修改的猫咪信息。

（3）流浪猫信息删除模块：负责删除流浪猫的基本信息，管理员可以通过该模块对流浪猫的基本信息进行删除。该模块调用了流浪猫信息查询模块，通过接口获取需要删除的猫咪信息。

（4）流浪猫信息查询模块：负责查询流浪猫的基本信息，管理员和普通用户均可以通过该模块查询流浪猫的基本信息。该模块提供了多种查询方式，如按照性别、年龄、品种、颜色等条件进行筛选。同时该模块还提供了排序和分页等功能，方便用户浏览。该模块调用了流浪猫信息查询模块，通过接口获取需要审核的猫咪信息和照片信息。

（5）数据统计模块：用于统计和分析平台上的流浪猫信息和活动信息，包括浏览量、收藏量、领养申请量、领养成功率等等，以便管理员和运营人员更好地了解用户需求和平台运营情况，做出相应的决策和调整。

 

**3、领养申请管理模块**

功能描述：管理员对用户提交的领养申请进行审核，可以浏览用户提交的申请表，并选择是否审核通过，该模块主要包括以下几个子模块：

（1）领养申请浏览模块：管理员可以查看用户提交的领养申请表单信息

（2）领养申请审核模块：管理员可以选择审核通过或拒绝用户的领养申请

调用关系：领养申请浏览模块调用领养申请审核模块，管理员在审核模块中进行审核操作

接口说明：管理员在审核模块中对用户提交的领养申请进行审核操作，审核结果会在系统中记录下来，用户可以在系统中查询审核结果

人机界面：管理员界面

 

**4、 用户权限管理模块**

功能描述：系统区分普通用户和管理员，管理员具备更高的权限，可以对系统中的数据进行管理操作，该模块主要包括以下几个子模块：

（1）用户注册模块：用户可以在系统中进行注册，注册后可以成为普通用户

（2）用户登陆模块：用户需要进行微信授权登录才能访问系统中的功能模块

（3）管理员添加模块：管理员可以在系统中添加其他管理员用户，赋予不同的权限

（4）权限管理模块：管理员可以在系统中管理用户的权限，例如可以封禁某个用户或恢复被封禁的用户等操作

调用关系：用户需要在系统中进行注册才能成为普通用户，在访问系统中的功能模块时需要进行微信授权登录，管理员可以在权限管理模块中管理用户的权限，包括封禁或恢复被封禁的用户等操作

接口说明：管理员可以在权限管理模块中对用户进行权限管理操作，例如添加管理员用户、封禁或恢复用户等操作

（5）人机界面：普通用户和管理员界面

（6） 活动管理模块：用于发布和管理流浪猫相关的公益活动、爱心捐赠、文明宣传等特色活动。管理员可以在后台添加、编辑和删除活动信息，普通用户可以在前台浏览并参与这些活动。

以上就是该项目的所有功能模块，它们之间有着不同的层次结构、调用关系和接口交互，通过对这些模块进行合理的设计和开发，可以实现对流浪猫信息的整合和管理，提高流浪猫的救助和领养效率，同时也为广大爱心人士提供了一个展示自己爱心的平台。在人机界面设计方面，需要考虑用户体验和易用性，保证界面简洁明了、操作简单方便，符合用户习惯和使用需求。

# 三、详细设计

基于微信小程序开发的服务于流浪猫项目是一个为流浪猫提供救助和寻找新家庭的平台。下面分别从界面设计、数据库设计和关键算法三个方面进行说明。

1、界面设计

该小程序包括了以下主要页面：首页、猫咪信息页、活动页、精选页、识猫页、关于页。

其中。

 

![img](file:////Users/chenyq/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_image002.png)

 

首页：展示了最新救助的流浪猫信息以及最近成功领养的猫咪，同时提供了搜索、筛选、领养信息的功能。

猫咪信息页：展示了当前需要救助的流浪猫的信息，包括猫咪的照片、性别、年龄、病情、所在地等信息，并提供了流浪猫对应的评论区，从而得到流浪猫的最新情况。

活动页：展示了流浪猫活动页是针对流浪猫主题的活动页面，通常用于宣传和组织与流浪猫有关的活动。在流浪猫小程序中，主要用于发布流浪猫相关的公益活动，吸引更多的人参与到流浪猫保护和救助的行动中来。

精选页：展示一些性格温顺、可爱的流浪猫，同时也可以展示一些流浪猫的成长经历和照片。通过这些精选内容，可以让更多人了解到流浪猫的生活情况，以及领养流浪猫的意义和好处。

识猫页：是指在该平台上提供一些信息，帮助用户更好地了解流浪猫。

关于页：主要功能有投喂罐头、拍照月榜、开发团队、信息反馈，只有管理员才有的管理后台。

数据库是采用云数据库，下面展示部分设计数据的字段关系er图：

![img](file:////Users/chenyq/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_image003.png)


 

# 四、测试报告

测试概述：本次测试主要对流浪猫小程序进行功能测试，包括用户浏览流浪猫信息、申请领养、发布信息、管理流浪猫信息等功能的测试，以及对页面的兼容性和性能进行测试。

测试环境：

操作系统：MIUI 13.0.7稳定版 

设备型号：Redmik40

微信版本：8.0.34

测试内容：

**1、用户注册和登录测试** 

测试目的：测试用户注册和登录功能是否正常可用。

测试步骤：

·  打开小程序，点击“我的”页面

·  点击“登录”按钮，进行微信授权登录

·  进入“我的”页面，查看登录状态是否显示为“已登录” 

·  测试结果：用户注册和登录功能正常可用，登录状态显示正确。

**2、流浪猫信息浏览测试** 

测试目的：测试用户浏览流浪猫信息是否正常可用。 

测试步骤：

·  打开小程序，点击“流浪猫”页面

·  浏览流浪猫列表，点击某只流浪猫，进入流浪猫详情页

·  查看流浪猫的基本信息、照片和其他用户的评论 

·  测试结果：流浪猫信息浏览功能正常可用，流浪猫详情页显示正确。

**3、流浪猫识猫功能测试** 

测试目的：测试流浪猫识猫功能是否正常可用。 

测试步骤：

·  打开小程序，点击“识猫”页面

·  点击“识猫”按钮，进行识别

·  测试结果：测试流浪猫识猫功能正常使用。

**4、流浪猫活动信息浏览测试** 

测试目的：测试流浪猫活动信息浏览是否正常可用。 

测试步骤： 

·  打开小程序，点击“猫抓板”页面

·  浏览流浪猫活动页面，点击某个流浪猫相关活动，进入活动详情页

·  查看活动的基本信息、照片、内容

·  测试结果：流浪猫活动信息浏览能正常可用。

**5、流浪猫活动公告弹窗测试** 

测试目的：测试流浪猫活动公告弹窗是否正常可用。 

测试步骤： 

·  打开小程序，进入小程序界面，查看活动是否弹窗

·  测试结果：流浪猫活动公告弹窗能正常可用。

**6、精选流浪猫信息浏览测试** 

测试目的：测试精选流浪猫信息浏览是否正常可用 

测试步骤：

·  打开小程序，点击“精选”页面

·  进入“精选”页面，点击某只流浪猫，进入流浪猫详情页

·  查看流浪猫的基本信息、照片和其他用户的评论 

·  测试结果：流浪猫信息浏览功能正常可用，流浪猫详情页显示正确。

**7、流浪猫关于界面功能测试** 

测试目的：测试流浪猫关于界面功能是否正常可用。 

测试步骤： 

·  打开小程序，点击“关于”页面

·  浏览关于界面，点击里面的各项功能区域按钮，进入里面

·  查看功能是否实现，是否正常展示

·  测试结果：流浪猫关于界面能正常可用

**8、流浪猫管理后台功能测试** 

测试目的：测试流浪猫管理后台功能是否正常可用。 

测试步骤： 

·  打开小程序，点击“关于”页面，下滑至管理后台

·  点击里面的各项功能区域按钮，进入里面

·  查看功能是否实现，是否正常使用所对应的管理功能

·  测试结果：流浪猫管理后台能正常可用

# 五、安装及使用

\## 软件安装

\- 下载并安装微信开发者工具稳定版，如果已经安装，请检查升级

\- 下载并安装Nodejs 18.x(安装时注意要选上Add to PATH), Nodejs最低版本要求18 

 

\## 小程序部署 

**导入项目** 

\- 在微信开发者工具中导入项目，并修改AppID为你注册的小程序 

**安装npm库**

\- 在开发者工具中，打开终端

\- 输入命令进入miniprogram文件夹：cd miniprogram 

\- 输入命令：npm install，等待安装完成后，会在miniprogram文件夹下出现`node_modules`文件夹 

\- 点击上方栏“工具->构建npm”，完成后，会出现`miniprogram_npm`文件夹

# 六、项目总结

在本项目的开发过程中，我们团队遇到了许多挑战，但是通过相互协调、任务分解、技能提升等方式，我们成功地克服了这些困难，取得了不俗的成果。以下是我们在这个项目中的一些感悟和后续升级计划。

首先，在项目协调方面，我们发现团队合作非常重要。我们通过明确每个人的职责和分工，保持了良好的沟通和协调，从而能够更快地解决问题并实现目标。我们还学会了更好地管理时间，合理地安排各项任务，从而更高效地完成工作。

其次，在技能提升方面，我们了解到了更多有关微信小程序的知识和技能。我们的团队成员们都有丰富的编程经验，但在开发微信小程序方面，我们仍需不断学习。通过深入了解微信小程序的特点和规范，我们能够更好地开发出符合用户期望的产品。

在面向用户方面，我们始终注重用户体验和用户需求。我们通过用户反馈、市场调研等方式，不断改进产品，满足用户需求。我们也不断地更新和升级产品，加入更多有用的功能和优化体验，从而提高用户满意度。

最后，我们计划在未来进一步升级和优化产品，加入更多有用的功能和提高产品性能。我们将继续关注用户需求和市场变化，不断更新产品，以提供更好的用户体验和满足用户需求。我们相信，在不断学习和进步的过程中，我们的团队会越来越成熟，创造出更出色的产品。

 